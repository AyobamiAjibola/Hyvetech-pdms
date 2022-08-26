import TagRepository from "../../repositories/TagRepository";
import Tag from "../../models/Tag";
import { appModelTypes } from "../../@types/app-model";
import {
  Attributes,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  UpdateOptions,
} from "sequelize";
import ICrudDAO = appModelTypes.ICrudDAO;

export default class TagDAOService implements ICrudDAO<Tag> {
  private tagRepository: TagRepository;

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository;
  }

  create(
    values: CreationAttributes<Tag>,
    options?: CreateOptions<Tag>
  ): Promise<Tag> {
    return this.tagRepository.save(values, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<Attributes<Tag>>
  ): Promise<void> {
    return this.tagRepository.deleteById(id, options);
  }

  findAll(options?: FindOptions<Attributes<Tag>>): Promise<Tag[]> {
    return this.tagRepository.findAll(options);
  }

  findByAny(options: FindOptions<Attributes<Tag>>): Promise<Tag | null> {
    return this.tagRepository.findOne(options);
  }

  findById(
    id: number,
    options?: FindOptions<Attributes<Tag>>
  ): Promise<Tag | null> {
    return this.tagRepository.findById(id, options);
  }

  update(
    tag: Tag,
    values: InferAttributes<Tag>,
    options: UpdateOptions<Attributes<Tag>>
  ): Promise<Tag> {
    return this.tagRepository.updateOne(tag, values, options);
  }
}
