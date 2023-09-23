import AppLogger from "../utils/AppLogger";
import axios, { AxiosInstance } from "axios";
import dataStore from "../config/dataStore";
import settings from "../config/settings";

import BankService, * as appModelTypes from "./BankService";
import { TryCatch } from "../decorators";

import { ReferenceGenerator } from "./ReferenceGenerator";

const KUDA_API_TOKEN = "KUDA_API_TOKEN";

class KudaService implements BankService {
  private readonly network: AxiosInstance;
  private readonly logger = AppLogger.init(KudaService.name).logger;

  constructor() {
    this.network = axios.create({ baseURL: settings.kuda.host });

    this.network.interceptors.request.use(
      async (request) => {
        let token = await this.getToken();
        // let token = await dataStore.get(KUDA_API_TOKEN);
        if (!token) {
          token = await this.getToken();
          // await dataStore.set(KUDA_API_TOKEN, token);
          await dataStore.setEx(KUDA_API_TOKEN, token, { PX: 60 * 10 * 1000 });
        }
        request!.headers!["Authorization"] = `Bearer ${token}`;
        return request;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    this.network.interceptors.response.use(
      (value) => {
        if (!value.data.status) return Promise.reject(value.data?.message);

        return Promise.resolve(value);
      },
      (error) => {
        console.log("error> ", error);
        if (error.response && error.response.data) {
          this.logger.error(
            error?.response?.data,
            error?.request?.path,
            error?.request?.method,
            error?.request?.body
          );
          return Promise.reject(error);
        }
        this.logger.error(
          error?.message,
          error?.request?.path,
          error?.request?.method,
          error?.request?.body
        );
        return Promise.reject(error);
      }
    );
  }
  async updateAccount(
    payload: appModelTypes.AccountUpdateDTO
  ): Promise<appModelTypes.AccountResponseDTO> {
    const response = await this.network.post("", {
      servicetype: "ADMIN_UPDATE_VIRTUAL_ACCOUNT",
      requestref: ReferenceGenerator.generate(),
      data: {
        ...payload,
      },
    });

    return response.data.data as appModelTypes.AccountResponseDTO;
  }

  async performNameEnquiry(payload: appModelTypes.ConfirmRecipientDTO) {
    const response = await this.network.post("", {
      servicetype: "NAME_ENQUIRY",
      requestref: ReferenceGenerator.generate(),
      data: { ...payload },
    });
    return response.data.data as appModelTypes.AccountHolder;
  }

  @TryCatch
  async getAccountTransactionLog(
    payload: appModelTypes.AccountTransactionLogDTO
  ): Promise<appModelTypes.AccountTransactionsResponseDTO> {
    const response = await this.network.post("", {
      servicetype: "ADMIN_VIRTUAL_ACCOUNT_TRANSACTIONS",
      requestref: ReferenceGenerator.generate(),
      data: {
        trackingReference: payload.accountId,
        pageSize: payload?.page?.pageSize,
        pageNumber: payload?.page?.pageNumber,
      },
    });

    return response.data.data as appModelTypes.AccountTransactionsResponseDTO;
  }

  @TryCatch
  async getAccountTransactionLogFiltered(
      payload: appModelTypes.AccountTransactionLogDTO
    ): Promise<appModelTypes.AccountTransactionsResponseDTO> {
    const response = await this.network.post("", {
      ServiceType: "ADMIN_VIRTUAL_ACCOUNT_FILTERED_TRANSACTIONS",
      Data: {
        ...payload,
      },
    });

    return response.data.data as any;
  }

  @TryCatch
  async getBanks(): Promise<appModelTypes.Bank[]> {
    const response = await this.network.post("", {
      ServiceType: "BANK_LIST",
      requestref: ReferenceGenerator.generate(),
    });

    return (response.data?.data?.banks || []) as appModelTypes.Bank[];
  }
  @TryCatch
  async createAccount(payload: appModelTypes.AccountDTO) {
    const response = await this.network.post("", {
      ServiceType: "ADMIN_CREATE_VIRTUAL_ACCOUNT",
      RequestRef: ReferenceGenerator.generate(),
      Data: {
        ...payload,
      },
    });

    return response.data.data as appModelTypes.AccountResponseDTO;
  }

  @TryCatch
  async getAllAccount(payload: appModelTypes.PaginationDTO) {
    const response = await this.network.post("", {
      ServiceType: "ADMIN_VIRTUAL_ACCOUNTS",
      Data: {
        ...payload,
      },
    });

    return response.data.data as any;
  }

  @TryCatch
  async disableAccount(accountId: string) {
    const response = await this.network.post("", {
      ServiceType: "ADMIN_DISABLE_VIRTUAL_ACCOUNT",
      data: {
        trackingReference: accountId
      }
    })

    return response.data.data as any
  }

  @TryCatch
  async enableAccount(accountId: string) {
    const response = await this.network.post("", {
      ServiceType: "ADMIN_ENABLE_VIRTUAL_ACCOUNT",
      data: {
        trackingReference: accountId
      }
    })

    return response.data.data as any
  }

  @TryCatch
  async getMainAccountBalance() {
    return Promise.resolve(Object.create(null));
  }

  async getVirtualAccountBalance(accountId: string) {
    const response = await this.network.post("", {
      ServiceType: "RETRIEVE_VIRTUAL_ACCOUNT_BALANCE",
      RequestRef: ReferenceGenerator.generate(),
      data: {
        trackingReference: accountId,
      },
    });
    return response.data.data as appModelTypes.AccountBalanceDTO;
  }

  async getMainAccountTransactionLog(
    payload: appModelTypes.AccountTransactionLogDTO
  ) {
    const { page, ...rest } = payload;
    if (!payload.startDate || !payload.endDate) {
      delete rest.startDate;
      delete rest.endDate;
    }
    // console.log("values> ", {
    //   ServiceType: "ADMIN_MAIN_ACCOUNT_FILTERED_TRANSACTIONS",
    //   RequestRef: ReferenceGenerator.generate(),
    //   data: {
    //     ...rest,
    //     pageNumber: payload.page?.pageNumber || 1,
    //     pageSize: payload.page?.pageSize || 1000,
    //   },
    // });

    const response = await this.network.post("", {
      ServiceType: "ADMIN_MAIN_ACCOUNT_FILTERED_TRANSACTIONS",
      RequestRef: ReferenceGenerator.generate(),
      data: {
        ...rest,
        pageSize: payload.page?.pageSize || 1,
        pageNumber: payload.page?.pageNumber || 1000,
        // ...payload
      },
    });
    return response.data.data as appModelTypes.AccountTransactionsResponseDTO;
  }

  async intiateTransfer(payload: appModelTypes.AccountTransferDTO) {
    try {
      console.log(payload, 'payload')
      const response = await this.network.post("", {
        ServiceType: "VIRTUAL_ACCOUNT_FUND_TRANSFER",
        RequestRef: ReferenceGenerator.generate(),
        data: {
          ...payload,
        },
      });
      return response.data as appModelTypes.AccountTransferResponseDTO;
    } catch (error: any) {
      console.log("erro> ", error);
      return Promise.reject(new Error(error));
    }
  }

  async initiateBulkTransfer(payload: appModelTypes.BulkAccountTransferDTO) {
    try {
      const response = await this.network.post("", {
        ServiceType: "VIRTUAL_ACCOUNT_BULK_PAYMENT",
        RequestRef: ReferenceGenerator.generate(),
        Data: {
          ...payload
        }
      });
      return response.data as appModelTypes.AccountTransferResponseDTO;
    } catch (error: any) {
      console.log(error);
      return Promise.reject(new Error(error));
    }
  }

  async performBulkNameEnquiry(payload: appModelTypes.BulkNameEnquiryDTO) {
    try {
      const response = await this.network.post("", {
        ServiceType: "BULK_NAME_ENQUIRY",
        RequestRef: ReferenceGenerator.generate(),
        Data: payload
      });
      return response.data as appModelTypes.BulkNameEnquiryResponseDTO
    } catch (error: any) {
      return Promise.reject(new Error(error));
    }
  }

  @TryCatch
  async getToken() {
    const response = await axios.post(
      `${settings.kuda.host}/Account/GetToken`,
      {
        email: settings.kuda.email,
        apiKey: settings.kuda.apiKey,
      }
    );
    return response.data as string;
  }
}

export default KudaService;
