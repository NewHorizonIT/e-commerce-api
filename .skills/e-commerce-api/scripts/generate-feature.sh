#!/bin/bash
# Generate a new feature with all required files
# Usage: ./scripts/generate-feature.sh <feature-name>
# Example: ./scripts/generate-feature.sh product

FEATURE_NAME=$1

if [ -z "$FEATURE_NAME" ]; then
  echo "Usage: ./scripts/generate-feature.sh <feature-name>"
  echo "Example: ./scripts/generate-feature.sh product"
  exit 1
fi

# Convert to different cases
PASCAL_CASE=$(echo "$FEATURE_NAME" | sed -r 's/(^|-)(\w)/\U\2/g')
CAMEL_CASE=$(echo "$PASCAL_CASE" | sed 's/^./\L&/')

echo "Generating feature: $FEATURE_NAME"
echo "PascalCase: $PASCAL_CASE"
echo "camelCase: $CAMEL_CASE"

# Create directories
mkdir -p src/domain/entities
mkdir -p src/domain/repositories
mkdir -p src/domain/errors
mkdir -p src/application/dtos/$FEATURE_NAME
mkdir -p src/application/use-cases/$FEATURE_NAME
mkdir -p src/infrastructure/repositories
mkdir -p src/infrastructure/database/models
mkdir -p src/presentation/http/controllers
mkdir -p src/presentation/http/routes

echo "Directories created!"
echo ""
echo "Next steps:"
echo "1. Create src/domain/entities/${FEATURE_NAME}.entity.ts"
echo "2. Create src/domain/repositories/${FEATURE_NAME}.repository.ts"
echo "3. Create src/application/dtos/${FEATURE_NAME}/create-${FEATURE_NAME}.dto.ts"
echo "4. Create src/application/use-cases/${FEATURE_NAME}/create-${FEATURE_NAME}.use-case.ts"
echo "5. Create src/infrastructure/database/models/${FEATURE_NAME}.model.ts"
echo "6. Create src/infrastructure/repositories/${FEATURE_NAME}.repository.impl.ts"
echo "7. Create src/presentation/http/controllers/${FEATURE_NAME}.controller.ts"
echo "8. Create src/presentation/http/routes/${FEATURE_NAME}.routes.ts"
echo "9. Register repository in src/config/container.ts"
echo "10. Add routes to src/app.ts"
