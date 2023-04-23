import {
    Attributes,
    CreateOptions,
    CreationAttributes,
    DestroyOptions,
    FindOptions,
    InferAttributes,
    UpdateOptions,
  } from 'sequelize';

import ItemStock from '../../models/ItemStock';
import ItemStockRepository from '../../repositories/ItemStockRepository';
import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class ItemStockDAOService implements ICrudDAO<ItemStock> {
    private itemStockRepository: ItemStockRepository;

    constructor(itemStockRepository: ItemStockRepository) {
        this.itemStockRepository = itemStockRepository;
    }

    create(values: CreationAttributes<ItemStock>, options?: CreateOptions<Attributes<ItemStock>>): Promise<ItemStock> {
        return this.itemStockRepository.save(values, options);
    }

    deleteById(id: number, options?: DestroyOptions<ItemStock>): Promise<void> {
        return this.itemStockRepository.deleteById(id, options);
    }

    findAll(options?: FindOptions<Attributes<ItemStock>>): Promise<ItemStock[]> {
        return this.itemStockRepository.findAll(options);
    }

    findByAny(options: FindOptions<Attributes<ItemStock>>): Promise<ItemStock | null> {
        return this.itemStockRepository.findOne(options);
    }

    findById(id: number, options?: FindOptions<Attributes<ItemStock>>): Promise<ItemStock | null> {
        return this.itemStockRepository.findById(id, options);
    }

    update(
        itemStock: ItemStock,
        values: InferAttributes<ItemStock>,
        options: UpdateOptions<Attributes<ItemStock>>,
      ): Promise<ItemStock> {
        return this.itemStockRepository.updateOne(itemStock, values, options);
    }
}