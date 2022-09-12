import crypto from "crypto";

import VINDecoderProviderRepository from "../../repositories/VINDecoderProviderRepository";
import VINDecoderProvider from "../../models/VINDecoderProvider";
import { appModelTypes } from "../../@types/app-model";
import axiosClient from "../api/axiosClient";
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Optional,
  UpdateOptions,
} from "sequelize/types";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { appCommonTypes } from "../../@types/app-common";
import { AxiosResponse } from "axios";
import Generic from "../../utils/Generic";
import { VIN_FILTER_CONSTRAINTS } from "../../config/constants";
import VINRepository from "../../repositories/VINRepository";
import VIN from "../../models/VIN";
import { Attributes } from "sequelize";
import ICrudDAO = appModelTypes.ICrudDAO;
import VINProvider = appCommonTypes.VINProvider;

interface VINData {
  label: string;
  value: string;
}

export default class VINDecoderProviderDAOService
  implements ICrudDAO<VINDecoderProvider>
{
  private vinDecoderProviderRepository: VINDecoderProviderRepository;
  private vinRepository: VINRepository;

  constructor(
    vinDecoderProviderRepository: VINDecoderProviderRepository,
    vinRepository: VINRepository
  ) {
    this.vinDecoderProviderRepository = vinDecoderProviderRepository;
    this.vinRepository = vinRepository;
  }

  create(
    values: Optional<
      InferCreationAttributes<VINDecoderProvider>,
      NullishPropertiesOf<InferCreationAttributes<VINDecoderProvider>>
    >,
    options?: CreateOptions<Attributes<VINDecoderProvider>>
  ): Promise<VINDecoderProvider> {
    return this.vinDecoderProviderRepository.save(values, options);
  }

  update(
    vinDecoderProvider: VINDecoderProvider,
    values: InferAttributes<VINDecoderProvider>,
    options: UpdateOptions<InferAttributes<VINDecoderProvider>>
  ): Promise<VINDecoderProvider> {
    return this.vinDecoderProviderRepository.updateOne(
      vinDecoderProvider,
      values,
      options
    );
  }

  findById(
    id: number,
    options?: FindOptions<InferAttributes<VINDecoderProvider>>
  ): Promise<VINDecoderProvider | null> {
    return this.vinDecoderProviderRepository.findById(id, options);
  }

  deleteById(
    id: number,
    options?: DestroyOptions<InferAttributes<VINDecoderProvider>>
  ): Promise<void> {
    return this.vinDecoderProviderRepository.deleteById(id, options);
  }

  findByAny(
    options: FindOptions<InferAttributes<VINDecoderProvider>>
  ): Promise<VINDecoderProvider | null> {
    return this.vinDecoderProviderRepository.findOne(options);
  }

  findAll(
    options?: FindOptions<InferAttributes<VINDecoderProvider>>
  ): Promise<VINDecoderProvider[]> {
    return this.vinDecoderProviderRepository.findAll(options);
  }

  async decodeVIN(vin: string, provider: VINProvider): Promise<VINData[]> {
    let apiSecret,
      apiKey,
      apiPrefix,
      url,
      response: AxiosResponse,
      result: VINData[] = [];

    //Search and return VIN of it exist in local database
    const findVIN = await this.vinRepository.findOne({ where: { vin } });

    if (findVIN) {
      const vinToJSON = findVIN.toJSON();

      Object.keys(vinToJSON).forEach((key) => {
        result.push({
          label: Generic.convertTextToCamelcase(key),
          //@ts-ignore
          value: vinToJSON[key],
        });
      });

      result = result.filter((detail: any) =>
        VIN_FILTER_CONSTRAINTS.includes(detail.label)
      );

      return result;
    }

    if (provider.default) {
      apiSecret = provider.apiSecret;
      apiKey = provider.apiKey;
      apiPrefix = provider.apiPrefix;
      url = `${apiPrefix}/?id=${apiSecret}&key=${apiKey}&vin=${vin}`;
      response = await axiosClient.get(url);

      if (response.data === "Error") return this.getOtherProvider(vin);

      const results = response.data.Results;

      Object.keys(results[0]).forEach((key) => {
        result.push({
          label: Generic.convertTextToCamelcase(key),
          //@ts-ignore
          value: results[0][key],
        });
      });

      result = result.filter((detail: any) =>
        VIN_FILTER_CONSTRAINTS.includes(detail.label)
      );

      let temp = [...result];

      temp = temp.filter((value) => value.label !== "vin");

      const emptyResult = temp.every((item) => !item.value.length);

      if (emptyResult) return this.getOtherProvider(vin);
    } else {
      const apiSecret = provider.apiSecret;
      const apiKey = provider.apiKey;
      const apiPrefix = provider.apiPrefix;

      const id = "decode";
      const hash = crypto
        .createHash("sha1")
        .update(`${vin}|${id}|${apiKey}|${apiSecret}`)
        .digest("hex");

      const controlSum = hash.substring(0, 10);
      url = `${apiPrefix}/${apiKey}/${controlSum}/decode/${vin}.json`;
      response = await axiosClient.get(url);

      result = response.data.decode
        .map((detail: any) => {
          return {
            label: Generic.convertTextToCamelcase(detail.label),
            value: detail.value,
          };
        })
        .filter((detail: any) => {
          return VIN_FILTER_CONSTRAINTS.includes(detail.label);
        });
    }

    const data = {};

    result.forEach((detail) => {
      //@ts-ignore
      data[detail.label] = detail.value;
    });

    //Create new VIN in local database
    await this.vinRepository.save(<VIN>data);

    return result;
  }

  async getOtherProvider(vin: string) {
    const otherProvider = await this.vinDecoderProviderRepository.findOne({
      where: { default: false },
    });

    if (!otherProvider) throw new Error("Provider does not exist");

    return this.decodeVIN(vin, otherProvider);
  }
}
