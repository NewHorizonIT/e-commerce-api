import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const swaggerPath = path.resolve(process.cwd(), 'docs', 'swagger.yml');

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
