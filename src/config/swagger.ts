import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// Resolve swagger path relative to the application root
// In both dev and production: __dirname resolves to dist/src/config in production
// We need to go up 3 levels: config -> src -> dist -> app root
const swaggerPath = path.resolve(__dirname, '../../..', 'docs', 'swagger.yml');

function loadSwaggerSpec(): Record<string, unknown> {
  if (!fs.existsSync(swaggerPath)) {
    throw new Error(`Swagger file not found at: ${swaggerPath}`);
  }

  const content = fs.readFileSync(swaggerPath, 'utf8');
  const parsed = yaml.load(content);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid swagger.yml content');
  }

  return parsed as Record<string, unknown>;
}

export const swaggerSpec = loadSwaggerSpec();
export const swaggerYamlText = fs.readFileSync(swaggerPath, 'utf8');
