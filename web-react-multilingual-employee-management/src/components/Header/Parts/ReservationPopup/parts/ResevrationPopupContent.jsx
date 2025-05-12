import React, { Component } from 'react';
import moment from 'moment';
//functions
import { generalGetRequest } from '../functions/api';
//components
import GeneralDropdown from '../../../../generals/generalDropdown/GeneralDropdown';
import InputGeneral from '../../../../generals/InputGeneral/InputGeneral';
import GeneralDatepicker from '../../../../generals/generalDatepicker/GeneralDatepicker';
import QuantityProcessPicker from './QuantityProcessPicker';
//icons
import { FormControlLabel, SvgIcon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
//cities
import { israelCities } from './cities';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import * as CurrencyFormat from 'react-currency-format';
import SystemEditPicker from './SystemEditPicker';
import { getOrderTypeValues } from '../../../../../functions/helpers/getOrderTypeValues';
import {
  CustomAutocomplete,
  CustomCheckbox,
  CustomTextField,
} from './ReservationPopupContent.styles';
import uuid from 'uuid';
import {
  METALPRESS_TECHNICIANS,
  METALPRESS_DOORS_PRODUCTION,
  METALPRESS_DOORS_INSTALLATION,
  METALPRESS_DOORS_ENGINEERING,
} from '../../../../../constants/sub-departments';
import {
  TOP_GROUP,
  METALPRESS,
  METALPRESS_DOORS,
  METALPRESS_WINDOWS,
} from '../../../../../constants/factories';
import { SERVICE_CALL, ORDER } from '../../../../../constants/order-types-values';
import AutocompleteSearch from '../../../../reused-components/AutocompleteSearch';
import { CREATE_CUSTOMER_POPUP } from '../../../../../constants/translations/customersPage';
import MultipleSelect from '../../../../generals/MultipleSelect';
import {
  INSTALLATION_RESOURCES,
  PRODUCTION_RESOURCES,
  PLANNED_DUE_DATE,
  ENGINEERING_RESOURCES,
} from '../../../../../constants/translations/reservationPopup';
import { excludeComasFromString } from '../../../../../utils/reservation-pop-up';
const { TERMS_OF_ENGAGEMENT } = CREATE_CUSTOMER_POPUP;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class ResevrationPopupContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentageError: false,
      blockDueDateCalculation: false,
      typeOptions: {},
      categoryOptions: {},
      systemsTypesOptions: {},
      paymentMethodOptions: {},
      termsPaymentOptions: {},
      processesOrder: { stages: [] },
      processesDataIds: [],
      processesDataNames: [],
      dynamicGeneralFields: [],
      dynamicFactoryFields: [],
      systemList: [],
      customersList: '',
      selectedCustomerId: '',
      productionResources: [],
      installationResources: [],
    };
  }

  getFullType = (typeOptions) => {
    const { formData } = this.props;
    if (typeOptions.length && formData.typeOfReservation && !formData.typeOfReservation._id) {
      let res = typeOptions.find(function (item) {
        return item.type === formData.typeOfReservation.type;
      });
      if (res) {
        this.props.updateFormData('typeOfReservation', res);
      }
    }
  };

  //   async componentDidMount() {
  //     let res = await generalGetRequest("/system/order-type/get");
  //     let res2 = await generalGetRequest(
  //       `/system/order/get-departments-for-order-form`
  //     );
  //     let res3 = await generalGetRequest(`/system/order-category/get`);

  //     let resSystemsTypes = null

  //     if(this.props.currentFactory_id !== METALPRESS){
  //         resSystemsTypes = await generalGetRequest(
  //         `/system/order-system-types/get`
  //       );
  //     }

  //     let resPaymentMethod = await generalGetRequest(
  //       `/system/order-payment-method/get`
  //     );
  //     let resTermsPayment = await generalGetRequest(
  //       `/system/order-terms-payment/get`
  //     );

  //     // let systemTypesForOrder = await generalGetRequest('/system/order-system-types/get')

  // // get resources for Metalpress tecnichians department

  //     let dataList = await generalGetRequest(`/system/order-systems/get-customers-list?factory_id=${this.props.currentFactory_id}`)
  //     if(dataList.result){
  //       this.setState({customersList:dataList.result})
  //     }

  //     if(this.props.currentFactory_id === METALPRESS){
  //       let technicianResource = await generalGetRequest(`/system/resources/get_by_department_id?department_id=${METALPRESS_TECHNICIANS}`)
  //       if(technicianResource.ok && technicianResource.result){
  //         this.setState({techniciansResource:technicianResource.result})
  //       }
  //     }else if (this.props.currentFactory_id === METALPRESS_DOORS && !this.props.editMode){
  //       try{
  //         const result = await Promise.all([
  //           generalGetRequest(`/system/resources/get_by_department_id?department_id=${METALPRESS_DOORS_PRODUCTION}`),
  //           generalGetRequest(`/system/resources/get_by_department_id?department_id=${METALPRESS_DOORS_INSTALLATION}`)
  //         ])
  //           const [productionResources, installationResources] = result.map(({ok, result}) => result)
  //           this.setState({productionResources, installationResources})
  //       }catch(e){
  //         console.log(e)
  //       }

  //     }

  //     if (res.ok) {
  //         this.getFullType(res.result)
  //         this.setState({ typeOptions: res.result });
  //     }

  //     if (res2.ok) {
  //       this.setState({ dynamicFactoryFields: res2.result });
  //     }

  //     if (res3.ok) {
  //       this.setState({ categoryOptions: res3.result });

  //       // fix "nail" for metalpress foctory form hide fields 'category && order type'  and settled values by default
  //       // The Category should be automatically set to Service Order
  //       // The Order Type should be automatically set to Technician Visit

  //       if(this.props.currentFactory_id === METALPRESS || this.props.selectedOrderType === SERVICE_CALL ){
  //         let [item] = res3.result.filter(i=>i.name_en === "Service Order")
  //         let res = await generalGetRequest(`/system/order-type/get?order_category_id=${item._id}`);
  //         if (res.ok) {
  //           this.props.updateFormData('category', item);
  //           this.setState({ typeOptions: res.result });
  //           let [type] = res.result.filter(i=>i.name === 'ביקור טכנאי')
  //           if(this.props.selectedOrderType === SERVICE_CALL ){
  //             type = res.result[0]
  //           }
  //           this.props.updateFormData("typeOfReservation", type);
  //         }
  //       }
  // // set type Work Order for creating order from customer page all factories except Metalpress
  //       if(this.props.selectedOrderType === ORDER ){
  //         let [item] = res3.result.filter(i=>i.name_en === "Work Order")
  //         let res = await generalGetRequest(`/system/order-type/get?order_category_id=${item._id}`);
  //         if (res.ok) {
  //           this.props.updateFormData('category', item);
  //           this.setState({ typeOptions: res.result });
  //         }
  //       }
  //       //--------------------------------------------------------------------
  //     }
  //     if (resSystemsTypes && resSystemsTypes.ok) {
  //         let result = resSystemsTypes.result.map((item)=>{
  //             return{...item, name:item.description}
  //         })
  //         this.setState({ systemsTypesOptions: result, systemTypes:resSystemsTypes.result });
  //     }

  //     if (resPaymentMethod.ok) {
  //       this.setState({ paymentMethodOptions: resPaymentMethod.result });
  //     }

  //     if (resTermsPayment.ok) {
  //       this.setState({ termsPaymentOptions: resTermsPayment.result });
  //     }

  //     // if(systemTypesForOrder.ok){
  //     //   this.setState({systemTypes:systemTypesForOrder.result})
  //     // }

  //     if (this.props.processOptions && this.props.processOptions.length) {
  //       //manipulate the array to get needed fields in 1 array of strings
  //       let processesDataIds = this.props.processOptions.map((item) => item._id);
  //       let processesDataNames = this.props.processOptions.map((item) => item.name);
  //       this.setState({ processesDataIds, processesDataNames });
  //     }

  //     //handle getting data for stages when edit mode
  //     if (this.props.editMode) {
  //       const temporaryType = this.props.currentFactory_id === METALPRESS ? 0 : this.props.formData.typeOfReservation.type;
  //       let dynamicGeneralFields = await generalGetRequest(
  //         `/system/order-input/get?type=${temporaryType}`
  //       );
  //       if (dynamicGeneralFields.ok) {
  //         // for Metalpress factory inserts systems between inputs && text areas
  //         // Hide two fields by name
  //         if(this.props.currentFactory_id === METALPRESS){
  //           // let filteredInputs = dynamicGeneralFields.result.filter(i=>i.input_type !== 'textarea')
  //           // let filteredTextAreas = dynamicGeneralFields.result.filter(i=>i.input_type === 'textarea')
  //           // this.setState({ dynamicGeneralFields: filteredInputs, dynamicTextAreas:filteredTextAreas });
  //           let copyDynamicGeneralFields =  [...dynamicGeneralFields.result]
  //           let elIndex = copyDynamicGeneralFields.findIndex(i=>i.name === 'הערות')
  //               copyDynamicGeneralFields.push(copyDynamicGeneralFields[elIndex])
  //               copyDynamicGeneralFields.splice(copyDynamicGeneralFields[elIndex],1)
  //           let filteredInputs = copyDynamicGeneralFields.filter(i=>i.input_type !== 'textarea').filter(i=>i.name !== "שם לחשבונית").filter(i=>i.name !== "אימייל איש קשר")
  //           let filteredTextAreas = copyDynamicGeneralFields.filter(i=>i.input_type === 'textarea')
  //               this.setState({ dynamicGeneralFields: filteredInputs, dynamicTextAreas:filteredTextAreas });
  //         }else{
  //           this.setState({ dynamicGeneralFields: dynamicGeneralFields.result });
  //         }
  //       }

  //       if (this.props.formData.collection_stages != null)
  //         setTimeout(() => {
  //           let newState = [...this.props.formData.collection_stages]
  //           this.setState({
  //             processesOrder: {
  //               ...this.state.processesOrder,
  //               stages: newState,
  //             },
  //           });
  //         }, 0);
  //     }

  //     if(this.props.formData.system_list && this.props.formData.system_list.length > 0){
  //       this.setState({systemList:this.props.formData.system_list})
  //     }
  //    if(this.props.formData.customer_id){
  //      this.setState({selectedCustomerId: this.props.formData.customer_id})
  //    }
  //   }

  async componentDidMount() {
    const REQUESTS = [
      generalGetRequest('/system/order-type/get'),
      generalGetRequest(`/system/order/get-departments-for-order-form`),
      generalGetRequest(`/system/order-category/get`),
      generalGetRequest(`/system/order-payment-method/get`),
      generalGetRequest(`/system/order-terms-payment/get`),
      generalGetRequest(
        `/system/order-systems/get-customers-list?factory_id=${this.props.currentFactory_id}`,
      ),
    ];

    const [res, res2, res3, resPaymentMethod, resTermsPayment, dataList] = await Promise.all(
      REQUESTS,
    );

    let resSystemsTypes = null;

    if (this.props.currentFactory_id !== METALPRESS) {
      resSystemsTypes = await generalGetRequest(`/system/order-system-types/get`);
    }

    // let systemTypesForOrder = await generalGetRequest('/system/order-system-types/get')

    // get resources for Metalpress tecnichians department

    this.setState({
      customersList: dataList?.result || [],
      typeOptions: res?.result || [],
      dynamicFactoryFields: res2?.result || [],
      categoryOptions: res3?.result || [],
      paymentMethodOptions: resPaymentMethod?.result || [],
      termsPaymentOptions: resTermsPayment?.result || [],
    });

    if (this.props.currentFactory_id === METALPRESS) {
      let technicianResource = await generalGetRequest(
        `/system/resources/get_by_department_id?department_id=${METALPRESS_TECHNICIANS}`,
      );
      if (technicianResource.ok && technicianResource.result) {
        this.setState({ techniciansResource: technicianResource.result });
      }
    } else if (this.props.currentFactory_id === METALPRESS_DOORS) {
      try {
        const result = await Promise.all([
          generalGetRequest(
            `/system/resources/get_by_department_id?department_id=${METALPRESS_DOORS_ENGINEERING}`,
          ),
          generalGetRequest(
            `/system/resources/get_by_department_id?department_id=${METALPRESS_DOORS_PRODUCTION}`,
          ),
          generalGetRequest(
            `/system/resources/get_by_department_id?department_id=${METALPRESS_DOORS_INSTALLATION}`,
          ),
        ]);
        const [engineeringResources, productionResources, installationResources] = result.map(
          ({ ok, result }) => result,
        );
        this.setState({ engineeringResources, productionResources, installationResources });
      } catch (e) {
        console.log(e);
      }
    }

    if (res3.ok) {
      // fix "nail" for metalpress foctory form hide fields 'category && order type'  and settled values by default
      // The Category should be automatically set to Service Order
      // The Order Type should be automatically set to Technician Visit

      if (
        this.props.currentFactory_id === METALPRESS ||
        this.props.selectedOrderType === SERVICE_CALL
      ) {
        let [item] = res3.result.filter((i) => i.name_en === 'Service Order');
        let res = await generalGetRequest(`/system/order-type/get?order_category_id=${item._id}`);
        if (res.ok) {
          this.props.updateFormData('category', item);
          this.setState({ typeOptions: res.result });
          let [type] = res.result.filter((i) => i.name === 'ביקור טכנאי');
          if (this.props.selectedOrderType === SERVICE_CALL) {
            type = res.result[0];
          }
          if (!this.props?.formData?.typeOfReservation?.name) {
            this.props.updateFormData('typeOfReservation', type);
          }
        }
      }
      // set type Work Order for creating order from customer page all factories except Metalpress
      if (this.props.selectedOrderType === ORDER) {
        let [item] = res3.result.filter((i) => i.name_en === 'Work Order');
        let res = await generalGetRequest(`/system/order-type/get?order_category_id=${item._id}`);
        if (res.ok) {
          this.props.updateFormData('category', item);
          this.setState({ typeOptions: res.result });
        }
      }
      //--------------------------------------------------------------------
    }
    if (resSystemsTypes && resSystemsTypes.ok) {
      let result = resSystemsTypes.result.map((item) => {
        return { ...item, name: item.description };
      });
      this.setState({ systemsTypesOptions: result, systemTypes: resSystemsTypes.result });
    }

    // if(systemTypesForOrder.ok){
    //   this.setState({systemTypes:systemTypesForOrder.result})
    // }

    if (this.props.processOptions && this.props.processOptions.length) {
      //manipulate the array to get needed fields in 1 array of strings
      let processesDataIds = this.props.processOptions.map((item) => item._id);
      let processesDataNames = this.props.processOptions.map((item) => item.name);
      this.setState({ processesDataIds, processesDataNames });
    }

    //handle getting data for stages when edit mode
    if (this.props.editMode) {
      const temporaryType =
        this.props.currentFactory_id === METALPRESS
          ? 0
          : this.props.formData.typeOfReservation.type;
      let dynamicGeneralFields = await generalGetRequest(
        `/system/order-input/get?type=${temporaryType}`,
      );
      if (dynamicGeneralFields.ok) {
        // for Metalpress factory inserts systems between inputs && text areas
        // Hide two fields by name
        if (this.props.currentFactory_id === METALPRESS) {
          // let filteredInputs = dynamicGeneralFields.result.filter(i=>i.input_type !== 'textarea')
          // let filteredTextAreas = dynamicGeneralFields.result.filter(i=>i.input_type === 'textarea')
          // this.setState({ dynamicGeneralFields: filteredInputs, dynamicTextAreas:filteredTextAreas });
          let copyDynamicGeneralFields = [...dynamicGeneralFields.result];
          let elIndex = copyDynamicGeneralFields.findIndex((i) => i.name === 'הערות');
          copyDynamicGeneralFields.push(copyDynamicGeneralFields[elIndex]);
          copyDynamicGeneralFields.splice(copyDynamicGeneralFields[elIndex], 1);
          let filteredInputs = copyDynamicGeneralFields
            .filter((i) => i.input_type !== 'textarea')
            .filter((i) => i.name !== 'שם לחשבונית')
            .filter((i) => i.name !== 'אימייל איש קשר');
          let filteredTextAreas = copyDynamicGeneralFields.filter(
            (i) => i.input_type === 'textarea',
          );
          this.setState({
            dynamicGeneralFields: filteredInputs,
            dynamicTextAreas: filteredTextAreas,
          });
        } else {
          this.setState({ dynamicGeneralFields: dynamicGeneralFields.result });
        }
      }

      if (this.props.formData.collection_stages != null)
        setTimeout(() => {
          let newState = [...this.props.formData.collection_stages];
          this.setState({
            processesOrder: {
              ...this.state.processesOrder,
              stages: newState,
            },
          });
        }, 0);
    }

    if (this.props.formData.system_list && this.props.formData.system_list.length > 0) {
      this.setState({ systemList: this.props.formData.system_list });
    }
    if (this.props.formData.customer_id) {
      this.setState({ selectedCustomerId: this.props.formData.customer_id });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    // calculate order due date
    const currentOrderType = this.props.formData.typeOfReservation.type;
    const previousOrderType = prevProps.formData.typeOfReservation.type;
    const editMode = this.props.editMode;
    if (
      !editMode &&
      typeof currentOrderType === 'number' &&
      currentOrderType !== previousOrderType
    ) {
      let resDueDate = await generalGetRequest(
        `/system/factory/calcduedate?factory_id=${this.props.currentFactory_id}&type=${currentOrderType}`,
      );
      if (resDueDate.ok) {
        this.updateFormData('due_date', resDueDate.result);
        this.setState({ blockDueDateCalculation: true });
      }
    }

    if (this.state.processesOrder && prevState.processesOrder)
      if (
        JSON.stringify(prevState.processesOrder.stages) !==
        JSON.stringify(this.state.processesOrder.stages)
      ) {
        this.props.updateFormData('collection_stages', this.state.processesOrder.stages);
      }

    if (this.state.percentageError && this.state.percentageError !== prevState.percentageError) {
      let form = document.getElementById('form_scroll');
      form.scrollTop = form.scrollHeight;
    }
    if (this.state.systemList && this.state.systemList !== prevState.systemList) {
      this.props.updateFormData('systemList', this.state.systemList);
    }
    if (
      this.state.selectedCustomerId &&
      this.state.selectedCustomerId !== prevState.selectedCustomerId &&
      !this.props.editMode
    ) {
      (async () => {
        this.setState({ systemTypes: [], systemsTypesOptions: [] });
        let customerActualSystems = await generalGetRequest(
          `/system/customer-page/get-customer-actual-systems-list?_id=${this.state.selectedCustomerId}`,
        );
        if (customerActualSystems.ok) {
          this.setState({
            systemTypes: customerActualSystems.result,
            systemsTypesOptions: customerActualSystems.result,
            systemList: customerActualSystems.result,
          });
        }
      })();
    }
  }

  async componentWillReceiveProps(nextProps) {
    //make the data for stages
    const editMode = this.props.editMode;
    if (this.props.formData.typeOfReservation.type !== nextProps.formData.typeOfReservation.type) {
      let type = nextProps.formData.typeOfReservation.type;
      await this.getStagesData(type);
    }

    //validate percents get to 100%
    if (this.props.initValidation !== nextProps.initValidation && nextProps.initValidation) {
      if (this.state.processesOrder && this.state.processesOrder.stages) {
        this.validateStages();
      }
    }

    //check if "service call" in metalpress account to get calculated due date from server

    if (
      !editMode &&
      nextProps.formData.typeOfReservation.formType === '7M' &&
      typeof nextProps.formData.typeOfReservation.type === 'number' &&
      !this.state.blockDueDateCalculation
    ) {
      let res = await generalGetRequest(
        `/system/factory/calcduedate?factory_id=${nextProps.formData.typeOfReservation.factory_id}&type=${nextProps.formData.typeOfReservation.type}`,
      );
      if (res.ok) {
        this.updateFormData('due_date', res.result);
        this.setState({ blockDueDateCalculation: true });
      }
    }
  }

  getStagesData = async (type) => {
    let processesOrder = await generalGetRequest(
      `/system/favorite-collection-stages/get?type=${type}`,
    );
    let processesData = await generalGetRequest(`/system/process/get?type=${type}`);
    const temporaryType = this.props.currentFactory_id === METALPRESS ? 0 : type;
    let dynamicGeneralFields = await generalGetRequest(
      `/system/order-input/get?type=${temporaryType}`,
    );

    if (dynamicGeneralFields.ok) {
      // for Metalpress factory insers systems between inputs && text areas
      if (this.props.currentFactory_id === METALPRESS) {
        let copyDynamicGeneralFields = [...dynamicGeneralFields.result];
        let elIndex = copyDynamicGeneralFields.findIndex((i) => i.name === 'הערות');
        copyDynamicGeneralFields.push(copyDynamicGeneralFields[elIndex]);
        copyDynamicGeneralFields.splice(copyDynamicGeneralFields[elIndex], 1);
        let filteredInputs = copyDynamicGeneralFields
          .filter((i) => i.input_type !== 'textarea')
          .filter((i) => i.name !== 'שם לחשבונית')
          .filter((i) => i.name !== 'אימייל איש קשר');
        let filteredTextAreas = copyDynamicGeneralFields.filter((i) => i.input_type === 'textarea');
        this.setState({
          dynamicGeneralFields: filteredInputs,
          dynamicTextAreas: filteredTextAreas,
        });
      } else {
        this.setState({ dynamicGeneralFields: dynamicGeneralFields.result });
      }
    }

    if (processesOrder.ok && processesOrder.result.length && !this.props.editMode) {
      this.setState({ processesOrder: processesOrder.result[0] });
      let processesDataIds = processesData.result.map((item) => item._id);
      let processesDataNames = processesData.result.map((item) => item.name);
      this.setState({ processesDataIds, processesDataNames });
    }
  };

  validateStages = () => {
    if (this.state.processesOrder.stages.length === 0) return;
    let sum = this.state.processesOrder.stages
      .map((item) => item.percentage)
      .reduce((total, num) => {
        return total + num;
      });
    if (Math.floor(sum) === 100 || Math.ceil(sum) === 100 || sum === 100) {
      this.setState({ percentageError: false });
      this.props.clearError('collection_stages');
    } else {
      this.setState({ percentageError: true });
      this.props.setError('collection_stages');
    }
  };

  updateFormDataCategory = async (name, item) => {
    if (this.props.editMode) return;
    let res = await generalGetRequest(`/system/order-type/get?order_category_id=${item._id}`);
    if (res.ok) {
      this.setState({ typeOptions: res.result });
    }

    this.props.updateFormData(name, item);
    this.props.updateFormData('typeOfReservation', { type: null });
  };

  updateFormData = (name, item) => {
    if (name === 'typeOfReservation') {
      this.props.onTypeChange(item);
    }

    if (name === 'value') {
      const formattedItem = excludeComasFromString(item);
      this.props.updateFormData(name, formattedItem);
      return;
    }

    this.props.updateFormData(name, item);
  };

  updateFormDataCheckBox = (event) => {
    this.props.updateFormData(event.target.name, event.target.checked);
  };

  updateFormDataSystemType = (e, option) => {
    let value = option.length
      ? option.map((element) => {
          return element;
        })
      : [];
    this.props.updateFormData('system_types', value);
  };

  changeQuantityProcess = (index, name, value) => {
    let newState = JSON.parse(JSON.stringify(this.state.processesOrder));
    if (name === 'percentage') {
      newState.stages[index][name] = Number(value);

      if (this.props.formData.value && this.props.formData.value > 0)
        newState.stages[index]['value'] = (100 / Number(value)) * this.props.formData.value;

      if (Number(value) === 0) newState.stages[index]['value'] = 0;
    } else if (name === 'value') {
      newState.stages[index].value = parseInt(value);

      if (this.props.formData.value && this.props.formData.value > 0) {
        newState.stages[index]['percentage'] = (Number(value) / this.props.formData.value) * 100;
      }

      if (Number(value) === 0) newState.stages[index]['percentage'] = 0;
    } else if (name === 'days') {
      newState.stages[index]['days'] = value;
    } else {
      newState.stages[index][name] = this.state.processesDataIds[value];
    }

    this.setState({ processesOrder: newState });
  };

  deleteQuantityProcess = (index) => {
    let newState = JSON.parse(JSON.stringify(this.state.processesOrder));
    newState.stages.splice(index, 1);
    this.setState({ processesOrder: newState });
  };

  addStep = () => {
    let newState = JSON.parse(JSON.stringify(this.state.processesOrder));
    newState.stages.push({
      // _id:this.state.processesDataIds[0],
      // process_id:this.state.processesDataIds[0],
      // percentage:0,
      // value:0
    });
    this.setState({ processesOrder: newState });
  };

  changeSystemInstance = (idx, name, value) => {
    let newState = [...this.state.systemList];
    newState[idx][name] = value;
    this.setState({ systemList: newState });
  };

  deleteSystemInstance = (index) => {
    let newState = [...this.state.systemList];
    newState.splice(index, 1);
    this.setState({ systemList: newState });
  };

  addSystem = () => {
    this.setState({
      systemList: [
        ...this.state.systemList,
        {
          system_name: '',
          quantity: '',
          temporarilyId: uuid(),
          system_note: '',
        },
      ],
    });
  };

  checkDynamicValueForFactoryFields = (field, name) => {
    if (!this.props.editMode) return;
    const { formData } = this.props;
    for (let i = 0; i < field.employees.length; i++) {
      for (let j = 0; j < formData.employees.length; j++) {
        if (field.employees[i][name] === formData.employees[j][name]) {
          return formData.employees[j][name];
        }
      }
    }
  };

  getCustomFieldValue = (arrayToChooseFrom, idToLookFor) => {
    let obj = arrayToChooseFrom.filter((item) => Object.keys(item)[0] === idToLookFor)[0];
    //if not found return null
    if (obj == null) return ''; //return null;
    let key = Object.keys(obj)[0];
    return obj[key];
  };

  getValueCategoryForDropdown = () => {
    const { formData } = this.props;
    const { categoryOptions } = this.state;
    if (categoryOptions.length && formData.category._id) {
      let res = categoryOptions.find(function (item) {
        return item._id === formData.category._id;
      });
      return res ? res.name : '';
    }
    return '';
  };

  getValuePaymentTermForDropdown = () => {
    const { formData } = this.props;
    const { termsPaymentOptions } = this.state;
    if (termsPaymentOptions.length && formData.terms_payment_id) {
      let res = termsPaymentOptions.find(function (item) {
        return item._id === formData.terms_payment_id;
      });
      return res ? res.name : '';
    }
    return '';
  };

  getValuePaymentMethodDropdown = () => {
    const { formData } = this.props;
    const { paymentMethodOptions } = this.state;
    if (paymentMethodOptions.length && formData.payment_method_id) {
      let res = paymentMethodOptions.find(function (item) {
        return item._id == formData.payment_method_id;
      });
      return res ? res.name : '';
    }
    return '';
  };

  getValueSystemDropdown = () => {
    const { formData } = this.props;
    const { systemsTypesOptions } = this.state;
    if (systemsTypesOptions.length && formData.system_types && formData.system_types.length) {
      return formData.system_types.map((element) => {
        return systemsTypesOptions.find(function (item) {
          return item._id === element;
        });
      });
    }
    return [];
  };

  checkDueDateCalculation = async () => {
    this.setState({ blockDueDateCalculation: false });
  };

  // updateCustomerSelect = (name, item) => {
  //     this.props.updateFormData(name, item);
  //     this.setState({selectedCustomerId:item._id})
  // }

  // for autocomplete customers
  updateCustomerSelect = (item) => {
    if (!item) {
      this.props.updateFormData('client_name', {});
      this.setState({ selectedCustomerId: '' });
      return;
    }
    this.props.updateFormData('client_name', item);
    this.setState({ selectedCustomerId: item?._id });
  };

  render() {
    const {
      mounted,
      editMode,
      formData,
      initValidation,
      processOptions,
      perUserMode,
      viewOnlyMode,
      currentFactory_id,
      closeIcon,
      selectedOrderType,
    } = this.props;
    const {
      typeOptions,
      categoryOptions,
      dynamicFactoryFields,
      dynamicGeneralFields,
      processesDataIds,
      processesDataNames,
      processesOrder,
      percentageError,
      systemsTypesOptions,
      paymentMethodOptions,
      termsPaymentOptions,
      systemTypes,
      systemList,
      techniciansResource,
      dynamicTextAreas,
      customersList,
      productionResources,
      installationResources,
      engineeringResources,
    } = this.state;
    let israelCitiesObjArray = israelCities.map((item) => {
      return { name: item };
    });

    const formattedValue =
      formData.value && typeof formData.value === 'string'
        ? Number(formData['value'].replace(/,/g, ''))
        : formData.value
        ? formData.value
        : '';

    return (
      <div
        className={
          mounted
            ? 'reservation-popup__content reservation-popup__content--active'
            : 'reservation-popup__content'
        }
        id="form_scroll"
      >
        {customersList ? (
          <div className="content-wrapper">
            {/* <header>{editMode ? "עריכת הזמנה" : "הוספת הזמנה"}</header> */}
            <header>
              <span>{editMode ? 'עריכת הזמנה' : 'הוספת הזמנה'}</span>
              <section className="">
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={formData.cancelled ? formData.cancelled : false}
                      onChange={this.updateFormDataCheckBox}
                      name="cancelled"
                    />
                  }
                  label="ביטול הזמנה"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <CustomCheckbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={formData.proposal ? formData.proposal : false}
                      onChange={this.updateFormDataCheckBox}
                      name="proposal"
                    />
                  }
                  label="הצעה"
                  labelPlacement="end"
                />
              </section>
              {closeIcon}
            </header>

            {this.props.currentFactory_id !== METALPRESS && (
              <section className="reservation-popup__content__form-group">
                <label>קטגוריה</label>
                <GeneralDropdown
                  options={categoryOptions}
                  dynamicValueForMapping={'name'}
                  placeholder={'בחר קטגוריית הזמנה'}
                  stateName={'category'}
                  updateFormData={this.updateFormDataCategory}
                  errorMessage={'בחר קטגוריית הזמנה'}
                  required={true}
                  initValidation={initValidation}
                  setError={this.props.setError}
                  clearError={this.props.clearError}
                  disabled={
                    editMode ||
                    perUserMode ||
                    selectedOrderType === ORDER ||
                    selectedOrderType === SERVICE_CALL
                  }
                  customPickCallback={this.checkDueDateCalculation}
                  value={this.getValueCategoryForDropdown()}
                />
              </section>
            )}
            {this.props.currentFactory_id !== METALPRESS && (
              <section className="reservation-popup__content__form-group">
                <label>סוג הזמנה</label>
                <GeneralDropdown
                  options={typeOptions}
                  dynamicValueForMapping={'name'}
                  placeholder={'בחר סוג הזמנה'}
                  stateName={'typeOfReservation'}
                  updateFormData={this.updateFormData}
                  errorMessage={'אנא בחר סוג הזמנה'}
                  required={true}
                  initValidation={initValidation}
                  setError={this.props.setError}
                  clearError={this.props.clearError}
                  disabled={editMode || perUserMode || selectedOrderType === SERVICE_CALL}
                  value={this.props.formData.typeOfReservation.name || ''}
                  customPickCallback={this.checkDueDateCalculation}
                />
              </section>
            )}

            {formData.typeOfReservation.type != null ? (
              <div className="reservation-popup__content__all-values">
                {/* if Metalpress */}
                <section
                  className={
                    this.props.currentFactory_id === METALPRESS
                      ? 'reservation-popup__content__form-group reservation-popup__content__form-group--row'
                      : 'reservation-popup__content__form-group'
                  }
                >
                  {this.props.currentFactory_id === METALPRESS ? (
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label htmlFor="">מספר הזמנה / קריאה</label>
                      <InputGeneral
                        typeOfInput={'text'}
                        updateFormData={this.updateFormData}
                        name={'order_number'}
                        value={formData.order_number}
                        errorMessageEmpty={'אנא מלא שדה זה'}
                        initValidation={initValidation}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        disabled={perUserMode}
                      />
                    </div>
                  ) : (
                    <>
                      <label htmlFor="">מספר הזמנה / קריאה</label>
                      <InputGeneral
                        typeOfInput={'text'}
                        updateFormData={this.updateFormData}
                        name={'order_number'}
                        value={formData.order_number}
                        errorMessageEmpty={'אנא מלא שדה זה'}
                        initValidation={initValidation}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        disabled={perUserMode}
                      />
                    </>
                  )}
                  {/* if Metalpress ...............*/}
                  {/* technichians */}
                  {this.props.currentFactory_id === METALPRESS && techniciansResource && (
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label>שם טכנאי</label>
                      <GeneralDropdown
                        options={techniciansResource}
                        dynamicValueForMapping={'name'}
                        placeholder={'בחר טכנאי'}
                        stateName={'technician_resource'}
                        updateFormData={this.updateFormData}
                        initValidation={initValidation}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        disabled={perUserMode}
                        value={
                          formData.technician_resource ? formData.technician_resource.name : null
                        }
                      />
                    </div>
                  )}
                </section>

                {(formData.typeOfReservation.formType === '1' ||
                  formData.typeOfReservation.formType === '1M') && (
                  <section className="reservation-popup__content__form-group">
                    <label htmlFor="">תהליך</label>
                    <GeneralDropdown
                      options={processOptions}
                      dynamicValueForMapping={'name'}
                      onChange={this.updateFormData}
                      stateName={'custom_process'}
                      updateFormData={this.updateFormData}
                      errorMessage={'אנא בחר תהליך'}
                      initValidation={initValidation}
                      required={true}
                      setError={this.props.setError}
                      clearError={this.props.clearError}
                      value={formData.custom_process ? formData.custom_process.name : null}
                      disabled={editMode || perUserMode}
                    />
                  </section>
                )}

                <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                  <div
                    className={
                      this.props.currentFactory_id === METALPRESS
                        ? 'reservation-popup__content__form-group'
                        : 'reservation-popup__content__form-group--inner-part'
                    }
                  >
                    {/* <div className="reservation-popup__content__form-group">               */}
                    {this.props.currentFactory_id === METALPRESS_WINDOWS ||
                    formData.typeOfReservation.formType === '0M' ||
                    formData.typeOfReservation.formType === '1M' ||
                    formData.typeOfReservation.formType === '7M' ? (
                      <label htmlFor="">שם לקוח / פרויקט</label>
                    ) : (
                      <label htmlFor="">שם לקוח</label>
                    )}
                    <AutocompleteSearch
                      setValueHandler={this.updateCustomerSelect}
                      options={customersList}
                      value={formData.client_name || ''}
                      initValidation={initValidation}
                      name="client_name"
                      setError={this.props.setError}
                      clearError={this.props.clearError}
                      //  disabled = {editMode}
                    />
                  </div>

                  {formData.typeOfReservation.formType !== '7M' ? (
                    <>
                      {this.props.currentFactory_id === METALPRESS ? (
                        <div className="reservation-popup__content__form-group--inner-part">
                          <label htmlFor="">{TERMS_OF_ENGAGEMENT}</label>
                          <InputGeneral
                            typeOfInput={'text'}
                            value={formData.agreement_terms}
                            disabled={true}
                          />
                        </div>
                      ) : null}
                      <div className="reservation-popup__content__form-group--inner-part">
                        <label htmlFor="">{'תאריך מסירה'}</label>
                        <GeneralDatepicker
                          updateFormData={this.updateFormData}
                          stateName={`due_date`}
                          initValidation={initValidation}
                          required={true}
                          errorMessage={'אנא בחר תאריך'}
                          selectedDate={formData.due_date ? formData.due_date : null}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          // disableCurrentWeek={formData.typeOfReservation.type !== 1}
                          disabled={perUserMode}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label htmlFor="">ערך עסקה (לא כולל מע״מ)</label>
                      <InputGeneral
                        typeOfInput={'number'}
                        updateFormData={this.updateFormData}
                        name={'value'}
                        value={formData.value}
                        errorMessageEmpty={'אנא מלא שדה זה'}
                        required={formData.typeOfReservation.type !== 1}
                        initValidation={initValidation}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        disabled={perUserMode}
                      />
                    </div>
                  )}
                </section>

                {formData.typeOfReservation.formType !== '7' &&
                  formData.typeOfReservation.formType !== '7M' && (
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <div className="reservation-popup__content__form-group--inner-part">
                        <label htmlFor="">מספר טלפון</label>
                        <InputGeneral
                          typeOfInput={'phone'}
                          updateFormData={this.updateFormData}
                          name={'client_phone'}
                          value={formData.client_phone}
                          errorMessageEmpty={'אנא מלא שדה זה'}
                          errorMessageInvalid={'מספר טלפון לא תקין'}
                          // required = {formData.typeOfReservation.type !== 1 ? true:false}
                          initValidation={initValidation}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          disabled={perUserMode}
                        />
                      </div>

                      {dynamicGeneralFields.map((item, index) => {
                        if (item.name === 'איש קשר') {
                          return (
                            <div
                              key={item._id}
                              className="reservation-popup__content__form-group--inner-part"
                            >
                              <label htmlFor="">{item.name}</label>
                              <InputGeneral
                                typeOfInput={item.input_type}
                                updateFormData={this.updateFormData}
                                name={'customFields'}
                                idForObj={item._id}
                                value={this.getCustomFieldValue(formData.customFields, item._id)}
                                errorMessageEmpty={'אנא מלא שדה זה'}
                                required={item.required && formData.typeOfReservation.type !== 1}
                                initValidation={initValidation}
                                setError={this.props.setError}
                                clearError={this.props.clearError}
                                disabled={perUserMode}
                              />
                            </div>
                          );
                        }
                      })}
                    </section>
                  )}

                {formData.typeOfReservation.formType !== '7' &&
                  formData.typeOfReservation.formType !== '7M' && (
                    <section
                      className="reservation-popup__content__form-group reservation-popup__content__form-group--row"
                      style={{ marginBottom: '0' }}
                    >
                      <div className="reservation-popup__content__form-group">
                        <label htmlFor="">מייל</label>
                        <InputGeneral
                          typeOfInput={'email'}
                          updateFormData={this.updateFormData}
                          name={'client_email'}
                          value={formData.client_email}
                          errorMessageEmpty={'אנא מלא שדה זה'}
                          errorMessageInvalid={'כתובת אימייל לא תקינה'}
                          required={false}
                          initValidation={initValidation}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          disabled={perUserMode}
                        />
                      </div>
                    </section>
                  )}

                {(this.props.currentFactory_id === METALPRESS ||
                  (formData.typeOfReservation.formType !== '7' &&
                    formData.typeOfReservation.formType !== '7M')) && (
                  <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label htmlFor="">ישוב</label>
                      <GeneralDropdown
                        options={israelCitiesObjArray}
                        dynamicValueForMapping={'name'}
                        onChange={this.updateFormData}
                        stateName={'city'}
                        updateFormData={this.updateFormData}
                        errorMessage={'אנא בחר ישוב'}
                        initValidation={initValidation}
                        required={formData.typeOfReservation.type !== 1}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        value={formData.city ? formData.city.name : null}
                        sortingInput={true}
                        disabled={perUserMode}
                      />
                    </div>
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label htmlFor="">כתובת</label>
                      <InputGeneral
                        typeOfInput={'text'}
                        updateFormData={this.updateFormData}
                        name={'address'}
                        value={formData.address}
                        errorMessageEmpty={'אנא מלא שדה זה'}
                        required={false}
                        initValidation={initValidation}
                        setError={this.props.setError}
                        clearError={this.props.clearError}
                        disabled={perUserMode}
                      />
                    </div>
                  </section>
                )}
                {formData.typeOfReservation.formType !== '7' &&
                  formData.typeOfReservation.formType !== '7M' && (
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <div className="reservation-popup__content__form-group--inner-part">
                        <label htmlFor="">מספר מפתחים</label>

                        <InputGeneral
                          typeOfInput={'number'}
                          updateFormData={this.updateFormData}
                          name={'quantity'}
                          value={formData.quantity}
                          errorMessageEmpty={'אנא מלא שדה זה'}
                          required={true}
                          initValidation={initValidation}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          disabled={perUserMode}
                        />
                      </div>
                      {!perUserMode && !viewOnlyMode && (
                        <div className="reservation-popup__content__form-group--inner-part">
                          <label htmlFor="">ערך עסקה (לא כולל מע״מ)</label>
                          <CurrencyFormat
                            decimalScale={2}
                            value={formData.value || ''}
                            displayType={'text'}
                            thousandSeparator={true}
                            decimalSeparator={'.'}
                            renderText={(formattedValue) => (
                              <InputGeneral
                                updateFormData={this.updateFormData}
                                name={'value'}
                                value={formattedValue}
                                errorMessageEmpty={'אנא מלא שדה זה'}
                                required={formData.typeOfReservation.type !== 1}
                                initValidation={initValidation}
                                setError={this.props.setError}
                                clearError={this.props.clearError}
                                disabled={perUserMode}
                              />
                            )}
                          />
                        </div>
                      )}
                    </section>
                  )}
                {this.props.currentFactory_id === METALPRESS_DOORS ? (
                  <React.Fragment>
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <MultipleSelect
                        label={ENGINEERING_RESOURCES}
                        options={engineeringResources || []}
                        handleChange={this.updateFormData}
                        value={formData?.resourcesForDepartments?.[METALPRESS_DOORS_ENGINEERING]}
                        stateName={METALPRESS_DOORS_ENGINEERING}
                      />
                    </section>
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <MultipleSelect
                        label={PRODUCTION_RESOURCES}
                        options={productionResources || []}
                        handleChange={this.updateFormData}
                        value={formData?.resourcesForDepartments?.[METALPRESS_DOORS_PRODUCTION]}
                        stateName={METALPRESS_DOORS_PRODUCTION}
                      />
                    </section>
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <MultipleSelect
                        label={INSTALLATION_RESOURCES}
                        options={installationResources || []}
                        handleChange={this.updateFormData}
                        value={formData?.resourcesForDepartments?.[METALPRESS_DOORS_INSTALLATION]}
                        stateName={METALPRESS_DOORS_INSTALLATION}
                      />
                    </section>
                  </React.Fragment>
                ) : null}
                {formData.typeOfReservation.formType !== '7' &&
                formData.typeOfReservation.formType !== '7M'
                  ? (dynamicFactoryFields.length > 0 || dynamicGeneralFields.length > 0) && (
                      <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                        {dynamicFactoryFields.map((field, index) => {
                          return (
                            <div
                              className="reservation-popup__content__form-group--inner-part"
                              style={index > 1 ? { marginTop: '20px' } : {}}
                              key={index}
                            >
                              <label htmlFor="">{field.name}</label>
                              <GeneralDropdown
                                options={field.employees}
                                // dynamicValueForMapping={"name"}
                                dynamicValueForMapping={'full_name'}
                                onChange={this.updateFormData}
                                stateName={`employee${field.name}`}
                                updateFormData={this.updateFormData}
                                errorMessage={'יש לבחור ערך'}
                                required={formData.typeOfReservation.type !== 1}
                                initValidation={initValidation}
                                setError={this.props.setError}
                                clearError={this.props.clearError}
                                value={this.checkDynamicValueForFactoryFields(field, 'full_name')}
                                disabled={perUserMode}
                              />
                            </div>
                          );
                        })}

                        {
                          // labor cost field for Metalpressdoors
                          this.props.currentFactory_id === METALPRESS_DOORS && (
                            <div className="reservation-popup__content__form-group--inner-part">
                              <label htmlFor="">עלות עבודה</label>
                              <InputGeneral
                                typeOfInput={'text'}
                                updateFormData={this.updateFormData}
                                name={'labor_cost'}
                                value={formData.labor_cost}
                                // errorMessageEmpty={"אנא מלא שדה זה"}
                                // errorMessageInvalid={"מספר טלפון לא תקין"}
                                // initValidation={initValidation}
                                setError={this.props.setError}
                                clearError={this.props.clearError}
                                disabled={perUserMode}
                              />
                            </div>
                          )
                        }
                        <div
                          style={{ marginTop: '20px' }}
                          className="reservation-popup__content__form-group reservation-popup__content__form-group--row"
                        >
                          {dynamicGeneralFields.map((item, index) => {
                            let className;
                            if (item.input_type === 'textarea') {
                              className = 'reservation-popup__content__form-group';
                            } else if (item.input_type === 'textFull') {
                              className = 'reservation-popup__content__form-group';
                            } else if (item.input_type === 'textPart') {
                              className = 'reservation-popup__content__form-group--inner-part';
                            } else if (
                              dynamicGeneralFields.length === 2 &&
                              item.input_type !== 'textarea'
                            ) {
                              className = 'reservation-popup__content__form-group';
                            } else {
                              className = 'reservation-popup__content__form-group--inner-part';
                            }
                            if (item.name === 'איש קשר') {
                              return (
                                <div
                                  className="reservation-popup__content__form-group--inner-part"
                                  key={item._id}
                                >
                                  <label htmlFor="">מספר טלפון נוסף</label>
                                  <InputGeneral
                                    typeOfInput={'phone'}
                                    updateFormData={this.updateFormData}
                                    name={'second_phone'}
                                    value={formData.second_phone}
                                    errorMessageEmpty={'אנא מלא שדה זה'}
                                    errorMessageInvalid={'מספר טלפון לא תקין'}
                                    initValidation={initValidation}
                                    setError={this.props.setError}
                                    clearError={this.props.clearError}
                                    disabled={perUserMode}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div
                                key={item._id}
                                className={className}
                                style={
                                  index !== dynamicGeneralFields.length - 1
                                    ? { marginBottom: '20px' }
                                    : { marginBottom: '0px' }
                                }
                              >
                                <label htmlFor="">{item.name}</label>
                                <InputGeneral
                                  typeOfInput={item.input_type}
                                  updateFormData={this.updateFormData}
                                  name={'customFields'}
                                  idForObj={item._id}
                                  value={this.getCustomFieldValue(formData.customFields, item._id)}
                                  errorMessageEmpty={'אנא מלא שדה זה'}
                                  required={item.required && formData.typeOfReservation.type !== 1}
                                  initValidation={initValidation}
                                  setError={this.props.setError}
                                  clearError={this.props.clearError}
                                  disabled={perUserMode}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )
                  : dynamicGeneralFields.length > 0 && (
                      // removed margin -bottom for Metalpress
                      // <section className={this.props.currentFactory_id === METALPRESS ? "reservation-popup__content__form-group-Metalpress reservation-popup__content__form-group--row" : "reservation-popup__content__form-group reservation-popup__content__form-group--row"}>
                      <section
                        className={
                          'reservation-popup__content__form-group reservation-popup__content__form-group--row'
                        }
                      >
                        {this.props.currentFactory_id === TOP_GROUP &&
                          dynamicFactoryFields.map((field, index) => {
                            return (
                              <div
                                className="reservation-popup__content__form-group--inner-part"
                                style={
                                  index > 1
                                    ? { marginTop: '15px', marginBottom: '15px' }
                                    : { marginBottom: '15px' }
                                }
                                key={index}
                              >
                                <label htmlFor="">{field.name}</label>
                                <GeneralDropdown
                                  options={field.employees}
                                  dynamicValueForMapping={'name'}
                                  onChange={this.updateFormData}
                                  stateName={`employee${field.name}`}
                                  updateFormData={this.updateFormData}
                                  errorMessage={'יש לבחור ערך'}
                                  required={formData.typeOfReservation.type !== 1}
                                  initValidation={initValidation}
                                  setError={this.props.setError}
                                  clearError={this.props.clearError}
                                  value={this.checkDynamicValueForFactoryFields(field, 'name')}
                                  disabled={perUserMode}
                                />
                              </div>
                            );
                          })}
                        {dynamicGeneralFields.map((item, index) => {
                          let className;
                          if (item.input_type === 'textarea') {
                            className = 'reservation-popup__content__form-group';
                          } else if (item.input_type === 'textFull') {
                            className = 'reservation-popup__content__form-group';
                          } else if (item.input_type === 'textPart') {
                            className = 'reservation-popup__content__form-group--inner-part';
                            // --------- commented this class for Metalpress to hide fields above textAreas && and fit other 2 fields into 1 row
                            // } else if( dynamicGeneralFields.length === 2 && item.input_type !== "textarea"){
                            //   className = "reservation-popup__content__form-group"
                          } else {
                            className = 'reservation-popup__content__form-group--inner-part';
                          }
                          if (item.name === 'איש קשר') {
                            return (
                              <div
                                className="reservation-popup__content__form-group--inner-part"
                                style={{ marginBottom: '15px' }}
                                key={item._id}
                              >
                                <label htmlFor="">מספר טלפון נוסף</label>
                                <InputGeneral
                                  typeOfInput={'phone'}
                                  updateFormData={this.updateFormData}
                                  name={'second_phone'}
                                  value={formData.second_phone}
                                  errorMessageEmpty={'אנא מלא שדה זה'}
                                  errorMessageInvalid={'מספר טלפון לא תקין'}
                                  initValidation={initValidation}
                                  setError={this.props.setError}
                                  clearError={this.props.clearError}
                                  disabled={perUserMode}
                                />
                              </div>
                            );
                          }
                          return (
                            <div
                              key={item._id}
                              className={className}
                              style={{ marginBottom: '15px' }}
                              // style={index !== dynamicGeneralFields.length - 1 ? { marginBottom: "20px" } : {marginBottom: "0px" }}
                            >
                              <label htmlFor="">{item.name}</label>
                              <InputGeneral
                                typeOfInput={item.input_type}
                                updateFormData={this.updateFormData}
                                name={'customFields'}
                                idForObj={item._id}
                                value={this.getCustomFieldValue(formData.customFields, item._id)}
                                errorMessageEmpty={'אנא מלא שדה זה'}
                                required={item.required && formData.typeOfReservation.type !== 1}
                                initValidation={initValidation}
                                setError={this.props.setError}
                                clearError={this.props.clearError}
                                disabled={perUserMode}
                              />
                            </div>
                          );
                        })}
                      </section>
                    )}
                {editMode && formData.plannedDueDate ? (
                  <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                    <div className="reservation-popup__content__form-group--inner-part">
                      <label htmlFor="">{PLANNED_DUE_DATE}</label>
                      <GeneralDatepicker selectedDate={formData.plannedDueDate} disabled={true} />
                    </div>
                  </section>
                ) : null}

                {this.props.currentFactory_id === METALPRESS && dynamicTextAreas && (
                  <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                    {dynamicTextAreas.map((item, index) => {
                      let className = 'reservation-popup__content__form-group';
                      return (
                        <div
                          key={item._id}
                          className={className}
                          style={
                            index !== dynamicTextAreas.length - 1
                              ? { marginBottom: '20px' }
                              : { marginBottom: '0px' }
                          }
                        >
                          <label htmlFor="">{item.name}</label>
                          <InputGeneral
                            typeOfInput={item.input_type}
                            updateFormData={this.updateFormData}
                            name={'customFields'}
                            idForObj={item._id}
                            value={this.getCustomFieldValue(formData.customFields, item._id)}
                            errorMessageEmpty={'אנא מלא שדה זה'}
                            required={item.required && formData.typeOfReservation.type !== 1}
                            initValidation={initValidation}
                            setError={this.props.setError}
                            clearError={this.props.clearError}
                            disabled={perUserMode}
                          />
                        </div>
                      );
                    })}
                  </section>
                )}
                {/* hide 2 fields in Metalpress account in bottom by adding this.props.currentFactory_id !== METALPRESS below */}
                {(formData.typeOfReservation.formType === '7' ||
                  formData.typeOfReservation.formType === '7M') &&
                  this.props.currentFactory_id !== METALPRESS && (
                    <section className="reservation-popup__content__form-group reservation-popup__content__form-group--row">
                      <div className="reservation-popup__content__form-group--inner-part">
                        <label htmlFor="">תנאי תשלום</label>
                        <GeneralDropdown
                          options={termsPaymentOptions}
                          placeholder={'בחר תנאי תשלום'}
                          dynamicValueForMapping={'name'}
                          onChange={this.updateFormData}
                          stateName={'termsPayment'}
                          updateFormData={this.updateFormData}
                          errorMessage={'אנא בחר תנאי תשלום'}
                          initValidation={initValidation}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          value={this.getValuePaymentTermForDropdown()}
                          disabled={perUserMode}
                        />
                      </div>
                      <div className="reservation-popup__content__form-group--inner-part">
                        <label htmlFor="">אופן תשלום</label>
                        <GeneralDropdown
                          options={paymentMethodOptions}
                          dynamicValueForMapping={'name'}
                          placeholder={'בחר אפשרות תשלום'}
                          stateName={'paymentMethod'}
                          onChange={this.updateFormData}
                          updateFormData={this.updateFormData}
                          errorMessage={'בבקשה בחר אמצעי תשלום'}
                          initValidation={initValidation}
                          setError={this.props.setError}
                          clearError={this.props.clearError}
                          value={this.getValuePaymentMethodDropdown()}
                          disabled={perUserMode}
                        />
                      </div>
                    </section>
                  )}
                {formData.typeOfReservation.formType === '7' ||
                  (formData.typeOfReservation.formType === '7M' && systemsTypesOptions.length > 0 && (
                    <section className="reservation-popup__content__form-group">
                      <label>סוג מערכת</label>
                      <CustomAutocomplete
                        multiple
                        options={systemsTypesOptions}
                        getOptionLabel={(option) => option?.name}
                        disableCloseOnSelect
                        defaultValue={() => this.getValueSystemDropdown()}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            <CustomCheckbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              size="small"
                              value="small"
                              checked={selected}
                            />
                            {option.name}
                          </React.Fragment>
                        )}
                        onChange={(e, option) => this.updateFormDataSystemType(e, option)}
                        renderInput={(params) => <CustomTextField {...params} variant="outlined" />}
                      />
                    </section>
                  ))}

                {!perUserMode &&
                  !viewOnlyMode &&
                  formData.typeOfReservation.formType !== '7' &&
                  formData.typeOfReservation.formType !== '7M' && (
                    <section className="reservation-popup__content__processes">
                      {processesOrder &&
                        processesOrder.stages &&
                        processesOrder.stages.map((process, index) => {
                          let newSum = formattedValue * (process.percentage / 100);
                          newSum = newSum % 1 !== 0 ? newSum.toFixed(2) : newSum;
                          let indexInArray = processesDataIds.findIndex((item) => {
                            return item === process.process_id;
                          });

                          return (
                            <QuantityProcessPicker
                              // this.props.editMode ? processesOrder.stages[index].name:
                              key={process.process_id}
                              name={processesDataNames[indexInArray]}
                              percentage={process.percentage}
                              nameOptions={processesDataNames}
                              daysToTheEndOfStage={process.days || 0}
                              value={
                                isNaN(process.percentage)
                                  ? process.value || ''
                                  : formattedValue && formattedValue > 0
                                  ? newSum
                                  : +process.value || 0
                              }
                              changeQuantityProcess={this.changeQuantityProcess}
                              index={index}
                              deleteQuantityProcess={this.deleteQuantityProcess}
                              resetDeleteMode={processesOrder.stages.length}
                              disabled={perUserMode}
                            />
                          );
                        })}

                      {percentageError ? (
                        <p className="reservation-popup__content__processes--error">
                          יש להשלים את סך האחוזים ל100%
                        </p>
                      ) : null}
                      <p
                        className="reservation-popup__content__processes--add-reservation"
                        onClick={() => {
                          this.addStep();
                        }}
                      >
                        <SvgIcon component={AddIcon} />
                        <span>הוסף שלב</span>
                      </p>
                    </section>
                  )}
                {this.props.currentFactory_id === METALPRESS ? (
                  // <section className="reservation-popup__content__processes"></section>
                  // styles for systems in bottom of form
                  <section className="reservation-popup__content__processes_Metalpress">
                    {systemList &&
                      systemList.length > 0 &&
                      systemList.map((i, idx) => {
                        return (
                          <SystemEditPicker
                            key={i._id ? i._id : i.temporarilyId}
                            systemTypes={systemTypes}
                            systemType={i.system_name ? i.system_name : ''}
                            systemActualName={i.actual_system_name ? i.actual_system_name : ''}
                            customer_id={this.props.formData.customer_id}
                            order_id={this.props.orderId}
                            system={i}
                            index={idx}
                            changeSystemInstance={this.changeSystemInstance}
                            deleteSystemInstance={this.deleteSystemInstance}
                          />
                        );
                      })}
                    <p
                      // className="reservation-popup__content__processes--add-reservation"
                      className="reservation-popup__content__processes--add-reservation-Metalpress"
                      onClick={() => {
                        this.addSystem();
                      }}
                    >
                      <SvgIcon component={AddIcon} />
                      <span>הוסף מערכת</span>
                    </p>
                  </section>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ResevrationPopupContent;
