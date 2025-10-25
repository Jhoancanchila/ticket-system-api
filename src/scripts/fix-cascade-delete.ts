/**
 * Script para agregar CASCADE DELETE a la tabla de comentarios
 * Ejecutar con: npm run ts-node src/scripts/fix-cascade-delete.ts
 */

import { sequelize } from '../infrastructure/database/sequelize/config';

async function fixCascadeDelete() {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('Conectado exitosamente');

    // Obtener el tipo de base de datos
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      console.log('Eliminando restricción de clave foránea existente...');
      await sequelize.query(`
        ALTER TABLE comments
        DROP CONSTRAINT IF EXISTS comments_ticketId_fkey;
      `);

      console.log('Agregando nueva restricción con ON DELETE CASCADE...');
      await sequelize.query(`
        ALTER TABLE comments
        ADD CONSTRAINT comments_ticketId_fkey
        FOREIGN KEY ("ticketId")
        REFERENCES tickets(id)
        ON DELETE CASCADE;
      `);

      console.log('✅ Restricción CASCADE DELETE aplicada correctamente');
    } else if (dialect === 'mysql' || dialect === 'mariadb') {
      console.log('Eliminando restricción de clave foránea existente...');
      
      // Obtener el nombre de la restricción
      const [constraints]: any = await sequelize.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'comments'
        AND COLUMN_NAME = 'ticketId'
        AND CONSTRAINT_SCHEMA = DATABASE();
      `);

      if (constraints.length > 0) {
        const constraintName = constraints[0].CONSTRAINT_NAME;
        await sequelize.query(`
          ALTER TABLE comments
          DROP FOREIGN KEY ${constraintName};
        `);
      }

      console.log('Agregando nueva restricción con ON DELETE CASCADE...');
      await sequelize.query(`
        ALTER TABLE comments
        ADD CONSTRAINT comments_ticketId_fkey
        FOREIGN KEY (ticketId)
        REFERENCES tickets(id)
        ON DELETE CASCADE;
      `);

      console.log('✅ Restricción CASCADE DELETE aplicada correctamente');
    } else if (dialect === 'sqlite') {
      console.log('SQLite detectado - requiere recrear la tabla...');
      console.log('Por favor, usa sequelize.sync({ force: true }) o recrea la base de datos');
    }

    await sequelize.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('❌ Error aplicando la migración:', error);
    process.exit(1);
  }
}

fixCascadeDelete();
