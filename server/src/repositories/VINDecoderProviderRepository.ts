import CrudRepository from '../helpers/CrudRepository';
import VINDecoderProvider from '../models/VINDecoderProvider';

export default class VINDecoderProviderRepository extends CrudRepository<VINDecoderProvider, number> {
  constructor() {
    super(VINDecoderProvider);
  }
}
