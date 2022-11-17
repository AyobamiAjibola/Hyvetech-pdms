import { Model } from 'sequelize-typescript';
import { Attributes } from 'sequelize';
import Joi from 'joi';

export default function schemaValidator<T extends Attributes<Model> = Attributes<Model>>(
  schema: Joi.PartialSchemaMap<T>,
) {
  return (model: T) => {
    return Joi.object(schema).validate(model);
  };
}
