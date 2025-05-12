import React, { Component } from 'react';
import he from 'date-fns/locale/he';
import 'moment/locale/he';
import DatePicker from 'react-datepicker';
import moment from 'moment';
//func
import { getClientDateForPopup } from '../../functions/api/popup';
import { CheckMobileOrTablet } from '../../functions/general/general';
//components
import MultiSelectDropDown from './updateProcessPopup/MultiSelectDropDown';
//redux configs
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
//variables
import { PER_USER } from '../../tools/keys/variables';
import { VIEW_ONLY } from '../../tools/keys/variables';
//img
import DateImg from '../../images/updatepopup/date.svg';
import closedLock from '../../images/updatepopup/closed-lock.svg';
import openLock from '../../images/updatepopup/openLock.svg';
//api calls
import {
  reportDone,
  updateProcess,
  getNotesForProcess,
  getProcessById,
  getResources,
  getOrderSystemsList,
  updateActualSystemCheckListSectionMobile,
} from '../../functions/api/orders';
import Loader from '../LoaderNew/Loader';
import '../../sass/popups/_update_proccess_popup.scss';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { mobileMaxWidth, tabletMaxWidth } from '../../constants/responsive-pop-up';
import * as momentBusinessDays from 'moment-business-days';
import { sendDelayedCheckLists } from '../../functions/helpers/offline-mode/sendDelayedCheckLists';
import ProcessStatusReport from './updateProcessPopup/components/processStatusReport';
import { DELAYED_CHECK_LIST_DATA } from '../../constants/offline-mode';
import OrderTasks from './updateProcessPopup/tasksPerOrder/OrderTasks';
import uuid from 'uuid';
import { EDIT_POP_UP } from '../../constants/translations/customersPage';
import DescriptionIcon from '@material-ui/icons/Description';
import { jss, theme, CustomCheckbox, styles } from './styles';
import SubmitSectionNotMetalpress from './updateProcessPopup/components/submitSectionNotMetalpress';
import { METALPRESS, METALPRESS_DOORS, DEMO, COCHAV, SERVICE } from '../../constants/factories';
import { UPDATE_PROCESS_POPUP } from '../../constants/translations/updateProcessPopUp';
import { getBadShowStoppers } from '../../functions/api/systems';
import Attachments from './updateProcessPopup/attachments/Attachments';
import TextRemark from './updateProcessPopup/TextRemark';
import GoogleMap from './updateProcessPopup/GoogleMap';
import ReviewPopup from './reviewPopup/ReviewPopup';
import { MILISECONDS_PER_HOUR } from '../../constants';
import StartAndEndTimeSection from './updateProcessPopup/tasksPerOrder/StartAndEndTimeSection';
import { calculateUsers } from './tools';
import DigitalSignature from './updateProcessPopup/DigitalSignature/DigitalSignature';
import DigitalSignatureBtn from './updateProcessPopup/DigitalSignature/DigitalSignatureBtn';
import { createPopupUrl, removePopupUrl } from '../../hooks/helper';
import { withRouter } from 'react-router';
const { SPLIT_PROCESS, REMARK } = UPDATE_PROCESS_POPUP;
const { CREATE_TASK } = EDIT_POP_UP;

momentBusinessDays.updateLocale('us', {
  workingWeekdays: [0, 1, 2, 3, 4],
});

const calculateEndDateAccordingToDuration = (
  processDate,
  process,
  user,
  original_date = null,
  original_duration = null,
) => {
  const { working_hours: workingHours, type_of_factory: typeOfFactory } = user;
  // Start date and time + Duration + Quantity * order units
  const { duration_days: durationDays, initial_duration: actualDuration } = process;
  // for SERVICE factory we have timer where calculation is in miliseconds, in other factories actual duration is in hours
  if (typeOfFactory !== SERVICE) {
    let date = moment(original_date || processDate)
      .set('hours', 16)
      .toDate();
    let endDate = momentBusinessDays(date, 'DD-MM-YYYY').businessAdd(
      original_duration || durationDays,
    )._d;
    let endDateSelectedTime = moment(endDate).set('hours', 16).toDate();
    return endDateSelectedTime;
  }
};

class UpdateProccessPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      original_date: moment(props.selectedProcess.proccess.original_date).toDate(),
      isDateReadOnly: props.selectedProcess.proccess.isDateReadOnly,
      show_error_popup: false,
      warning_message: '',
      resourcesDropdown: false,
      //form state
      startDate: moment(props.selectedProcess.proccess.process_date).toDate(),
      endDate: calculateEndDateAccordingToDuration(
        props.selectedProcess.proccess.process_date,
        props.selectedProcess.proccess,
        props.login.user,
      ),

      reportDone: '',
      finished: props.selectedProcess.proccess.finished,
      reason: '',
      approveName: '',
      prevFinishedValue: '',
      locked: props.selectedProcess.proccess.is_detached ? false : true,
      lockpopup: false,
      notes: '',
      load_button: false,
      dateChanged: false,
      resourcesList: [],
      initialResourcesList: [],
      selectedUser: props.selectedProcess.proccess.employee
        ? props.selectedProcess.proccess.employee
        : {},
      //loaders
      resourcesLoader: true,
      show_date_loader: true,
      notesLoader: true,
      backlog: props.sendBackToProduction ? false : props.selectedProcess.proccess.backlog,
      isService: props.login.user.type_of_factory === SERVICE,
      isMetalpressDoors: props.login.user.factory_id === METALPRESS_DOORS,
      isDemo: props.login.user.factory_id === DEMO,
      isCochav: props.login.user.factory_id === COCHAV,
      systemChecklistSection: null,
      systemsGeneralSection: null,
      isCheckListShown: false,
      isAddActualSystemPopUPShown: false,
      selectedSystemForEdit: '',
      isEditActualSystemPopUpShown: false,
      isMobile: window.innerWidth <= mobileMaxWidth,
      isTablet: window.innerWidth <= tabletMaxWidth,
      isOnline: navigator.onLine /*network status */,
      selectedSystemId: null /* if shown sub systems settled parent system id,else if systems list displayed - null */,
      tasks: null /* order tasks list */,
      sent_to_backlogs: props.selectedProcess.proccess.sent_to_backlogs,
      newTask: null /*new task to pass into Tasks and update order tasks list */,
      isAttachmentsListShown: false /*impact on displaying customer`s attached files list */,
      isDigitalSignatureOpen: false,
      // systemsOrderForDragAndDrop:[],/* order actual systems id for ordering with drag and drop */
      splitProcess: false /**create process duplication */,
      badSystemsList: null /* show stoppers list before client signature */,
      doTasksShown: false /* shows tasks list for Metalpress mobile */,
      quantity: props.selectedProcess.proccess.quantity,
      remark:
        props.selectedProcess.proccess.remark ||
        '' /*remarks value for Cachav factory 8 characters or so */,
      actualDuration: props.selectedProcess.proccess.initial_duration || '',
      startTime:
        props.selectedProcess.proccess.start_time || null /*process execution start time */,
      // currentParentSystemId: null,  /*point on parent system id in system layers */
      currentLayer: 1,
      systemLayers: null,
      customer_id: props.selectedProcess.proccess.customer_id,
      current_order_id: props.selectedProcess.proccess.order_id,
      selected_process_review: props.selectedProcess,
    };
    if ('setLoggedInData' in props) {
      props.setLoggedInData(props.login);
    }
  }

  openFrom = !!this.props.openFrom;

  async componentWillMount() {
    createPopupUrl(this.props.history);
    sendDelayedCheckLists();
    // if returning to production check if date is less then today, if so change it to today
    if (this.props.sendBackToProduction) {
      if (moment(moment(this.state.startDate).startOf()).isSameOrBefore(moment())) {
        this.setState({
          startDate: moment().toDate(),
        });
      }
    }

    const { original, _id, order_id } = this.props.selectedProcess.proccess;

    //get data for original process
    if (original) {
      let newProcess = await getProcessById(original);
    }
    let resourcesRes = await getResources(_id);
    if (resourcesRes.ok) {
      const resourcesQuntity = calculateUsers(resourcesRes.result);
      this.setState({
        resourcesList: resourcesRes.result.map((item) => item),
        resourcesLoader: false,
        resourcesQuntity,
      });
    } else {
      this.setState({
        resourcesLoader: false,
      });
    }
    // get notes for process
    let res = await getNotesForProcess(_id);
    if (res.ok) {
      this.setState({ notes: res.result, notesLoader: false });
    } else {
      this.setState({ notesLoader: false });
    }

    // get start & end dates for process
    {
      const startDate = this.props.selectedProcess.proccess.process_date;
      const user = this.props.login.user;
      this.setState({
        endDate: calculateEndDateAccordingToDuration(
          startDate,
          this.props.selectedProcess.proccess,
          user,
        ),
        startDate: moment(startDate).toDate(),
        show_date_loader: false,
      });
    }

    if (this.props.login.user.type_of_factory === SERVICE) {
      this.getAllOrderSystemsList(order_id);
    }
  }

  handleResize = (e) => {
    this.setState({ isMobile: window.innerWidth <= mobileMaxWidth });
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', this.handleNetworkStatus);
    window.addEventListener('offline', this.handleNetworkStatus);
  }

  handleNetworkStatus = () => {
    const isOnline = navigator.onLine;
    this.setState({ isOnline });
  };

  async componentWillReceiveProps(nextProps) {
    //fetch new data if process is not the original
    if (this.props.selectedProcess.proccess._id !== nextProps.selectedProcess.proccess._id) {
      let res = await getNotesForProcess(this.props.selectedProcess.proccess._id);
      if (res.ok) this.setState({ notes: res.result });

      this.setState({
        finished: nextProps.selectedProcess.proccess.finished,
      });

      // get start & end dates for process
      {
        const startDate = this.props.selectedProcess.proccess.process_date;
        const user = this.props.login.user;
        this.setState({
          endDate: calculateEndDateAccordingToDuration(
            startDate,
            this.props.selectedProcess.proccess,
            user,
          ),
          startDate: moment(startDate).toDate(),
        });
      }
    }
  }

  componentWillUnmount() {
    removePopupUrl(this.props.history);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('online', this.handleNetworkStatus);
    window.removeEventListener('offline', this.handleNetworkStatus);
  }

  componentDidUpdate(prevProps, prevState) {
    const currentSystemLayers = this.state.systemLayers;
    const previousSystemLayers = prevState.systemLayers;
    if (currentSystemLayers !== previousSystemLayers) {
      const delayedData = localStorage.getItem(DELAYED_CHECK_LIST_DATA);
      if (delayedData) this.setState({ delayedCheckLists: true });
      else this.setState({ delayedCheckLists: false });
    }
  }

  submit = (e) => {
    e.preventDefault();
  };

  toggleResourceDrop = () => {
    this.setState((prevState) => ({
      resourcesDropdown: !prevState.resourcesDropdown,
    }));
  };

  reportDone = async () => {
    const splitted = this.props.selectedProcess.proccess.is_splitted;
    // let maxVal = this.props.selectedProcess.proccess.quantity
    let maxVal = this.state.quantity;
    const { finished } = this.state;
    if (splitted) {
      this.setState({ quantity: finished });
      return;
    }
    this.setState({ finished: maxVal });
  };

  cancelDone = async () => {
    // this.setState({ finished: 0,isDone:false })
    this.setState({ finished: 0 });
  };

  createRemovedResourcesBody = async () => {
    const { resourcesList } = this.state;
    let initialResourcesList = await getResources(this.props.selectedProcess.proccess._id);
    let removedArray = [];

    if (initialResourcesList.ok) {
      initialResourcesList = initialResourcesList.result;
    } else {
      return [];
    }

    resourcesList.map((item, index1) =>
      item.resources.map((subitem, index2) => {
        if (
          !resourcesList[index1].resources[index2].current &&
          initialResourcesList[index1].resources[index2].current
        )
          removedArray.push(resourcesList[index1].resources[index2]._id);
        return;
      }),
    );
    return removedArray;
  };

  createAddedResourcesBody = async () => {
    const { resourcesList } = this.state;
    let initialResourcesList = await getResources(this.props.selectedProcess.proccess._id);
    let addedArray = [];

    if (initialResourcesList.ok) {
      initialResourcesList = initialResourcesList.result;
    } else {
      return [];
    }

    resourcesList.map((item, index1) =>
      item.resources.map((subitem, index2) => {
        if (
          resourcesList[index1].resources[index2].current &&
          !initialResourcesList[index1].resources[index2].current
        )
          addedArray.push(resourcesList[index1].resources[index2]._id);
        return;
      }),
    );

    return addedArray;
  };

  handleStartDateChange = (date) => {
    const original_duration = this.props.selectedProcess.proccess?.original_duration;
    const user = this.props.login.user;
    this.setState({
      startDate: date,
      original_date: date,
      dateChanged: true,
      actualDuration: this.captureCurrentDuration(),
      endDate: calculateEndDateAccordingToDuration(
        date,
        this.props.selectedProcess.proccess,
        user,
        date,
        original_duration,
      ),
    });
  };

  handleEndDateChange = (date) => {
    const workingHours = this.props.login.user.working_hours;
    const selectedProcess = this.props.selectedProcess.proccess;
    const { original_process_date: originalProcessDate, fraction } = selectedProcess;
    const startDate = fraction
      ? moment(originalProcessDate).set('hour', 16).toDate()
      : this.state.startDate;
    const datesDifference = moment(date, 'MM-DD-YYYY').businessDiff(
      moment(startDate, 'MM-DD-YYYY'),
      true,
    );
    const newActualDuration = (datesDifference + 1) * (workingHours * MILISECONDS_PER_HOUR);

    this.setState({
      endDate: date,
      actualDuration: this.captureCurrentDuration(),
      dateChanged: !moment(date).isSame(moment(this.state.endDate)),
    });
  };

  captureCurrentDuration = () => {
    const process_duration = Number(this.props.selectedProcess.proccess.initial_duration);
    const current_duration = Number(this.state.actualDuration);
    return process_duration === current_duration ? process_duration : current_duration;
  };

  changeDropData = (name, data) => {
    this.setState({
      [name]: data,
    });
  };

  findCompleteProcessEndData = (end_date, start_date) =>
    end_date >= start_date ? new Date() : new Date(start_date);

  submitForm = async (cb, is_preview) => {
    //init body for api
    const { selectedProcess, view, update_process_obj } = this.props;
    const { order_id: orderId } = selectedProcess.proccess;
    const {
      startDate,
      endDate,
      reason,
      approveName,
      notes,
      locked,
      finished,
      selectedUser,
      tasks,
      sent_to_backlogs,
      systemsOrderForDragAndDrop,
      splitProcess,
      quantity,
      remark,
      actualDuration,
      startTime,
      resourcesQuntity,
    } = this.state;
    this.setState((prev) => {
      return {
        ...prev,
        load_button: true,
      };
    });

    sendDelayedCheckLists();

    setTimeout(async () => {
      let body = {
        order_id: selectedProcess.proccess.order_id,
        process_id: selectedProcess.proccess.process_id,
        _id:
          selectedProcess.proccess.original ||
          selectedProcess.proccess._id /*order process id  or original order process id !!!!!!!*/,
        date: moment(startDate)._d,
        // date: moment(selectedProcess.proccess.process_date)._d,/*set process date because start date is cause of repositon and process vanished */
        endDate: this.state.dateChanged ? moment(endDate)._d : null,
        // endDate: moment(endDate)._d,
        from: moment(startDate).startOf('week')._d,
        to: moment(startDate).endOf('week')._d,
        view,
        reason: reason ? reason.value : '',
        approved_by: approveName ? approveName.value : '',
        process: selectedProcess.proccess,
        notes: notes ? notes : '',
        is_detached: locked ? false : true,
        finished: finished,
        done: String(quantity) === String(finished),
        // done:this.state.isDone,
        employee_id: selectedUser._id ? selectedUser._id : null,
        backlog: this.state.backlog,
        resources_added: await this.createAddedResourcesBody(),
        resources_removed: await this.createRemovedResourcesBody(),
        tasks,
        sent_to_backlogs,
        actual_systems: systemsOrderForDragAndDrop,
        splitProcess,
        remark,
        start_time: startTime,
        // actual_mps: actualMps
      };

      body.process.backlog = !!this.state.backlog;
      // add changed actual duration
      if (actualDuration) {
        let duration = +actualDuration * (resourcesQuntity || 1);
        body.initial_duration = new String(duration);
        body.actual_duration = duration;
        body.process.initial_duration = duration;
        body.process.actual_duration = duration;
      }
      let update_process_res = await updateProcess(body);
      if (update_process_res === undefined) {
        this.stopReviewSaveButtonLoader(is_preview);
        return;
      }
      let sendReportDonefinished = String(finished) === String(quantity);
      let report_done_res;

      if (sendReportDonefinished) {
        let end_date = this.findCompleteProcessEndData(
          new Date(body.endDate || endDate).getTime(),
          new Date(body.date || startDate).getTime(),
        );
        report_done_res = await reportDone({
          _id: this.props.selectedProcess.proccess._id,
          end_date,
        });
      }

      let finished_process_num = finished;
      if (
        // update_process_res.ok && update_general_section.ok &&
        update_process_res.ok &&
        Object.keys(update_process_res.result).length > 0
      ) {
        finished_process_num = update_process_res.result.finished;
      }

      //delete backlogs duplications
      if (body.process.backlog && this.props.deleteBacklogsDuplications) {
        let processCopy = { ...selectedProcess.proccess };
        this.props.deleteBacklogsDuplications(processCopy);
      }

      let selected_process_is_detached = selectedProcess.proccess.is_detached ? true : false;

      if (
        finished_process_num !== selectedProcess.proccess.finished ||
        selected_process_is_detached !== update_process_res.result.is_detached
      ) {
        update_process_obj({
          _id: selectedProcess.proccess._id,
          finished: finished_process_num,
          is_detached: locked ? false : true,
        });
      }

      if (true) {
        this.stopReviewSaveButtonLoader(is_preview);
        let refetch = true;

        if (this.props.selectedProcess.proccess.employee) {
          if (this.props.selectedProcess.proccess.employee.name !== this.state.selectedUser.name)
            refetch = true;
        } else {
          if (this.state.selectedUser.name) refetch = true;
        }

        this.props.submitUpdatesFromPopup(
          body,
          selectedProcess.proccess.constant,
          refetch,
          update_process_res.ok ? update_process_res.result : null,
          is_preview,
        );
      } else {
        this.setState({
          load_button: false,
        });
        this.props.closeUpdateMenu();
      }

      // to put the popup in all the screens!
      if (report_done_res) {
        if (typeof report_done_res.result === 'string') {
          this.props.setAlertPopupMessage(report_done_res.result);
          this.props.alertPopupToggle(true);
        }
      }
      cb && cb();
    }, 200);
  };

  stopReviewSaveButtonLoader = (input) => {
    if (input) {
      this.setState((prev) => {
        return { ...prev, load_button: false };
      });
    }
  };

  handleQuantityChange = (e) => {
    let value = e.target.value;
    let max = this.state.quantity;
    if (value > max) {
      value = max.toString();
    } else if (value < 0) {
      value = '0';
    }
    if (value) value = value.replace(/[^\d.-]/g, '');
    this.setState({
      finished: value,
    });
  };

  handleFocus = (e) => {
    let prevFinishedValue = this.state.finished;
    let newValue = e.target.value;
    this.setState({ prevFinishedValue, finished: '' });
  };

  handleBlur = (e) => {
    let prevFinishedValue = this.state.prevFinishedValue;
    let value = e.target.value;
    if (!value) this.setState({ prevFinishedValue: '', finished: prevFinishedValue });
  };

  filterDate = (date) => {
    if (this.props.offDays && this.props.offDays.length > 0) {
      if (!this.props.offDays.includes(moment(date).day())) {
        return date;
      }
    }
  };

  handleTextArea = (e) => {
    let notes = e.target.value;
    this.setState({
      notes,
    });
  };

  openLockPopup = () => {
    this.setState({ lockpopup: true });
  };

  closeLockPopup = () => {
    this.setState({ lockpopup: false });
  };

  incrementProcess = () => {
    if (this.state.finished + 1 <= this.state.quantity) {
      this.setState((prevState) => ({
        finished: prevState.finished + 1,
      }));
    }
  };

  decrementProcess = () => {
    if (this.state.finished > 0)
      this.setState((prevState) => ({
        finished: prevState.finished - 1,
      }));
  };

  handleCompletionsCheckbox = () => {
    this.setState((prevState) => ({
      backlog: !prevState.backlog,
    }));
  };

  openReservationPopup = async (order_process) => {
    const { selectedProcess } = this.props;
    if (this.props.login.user.type_of_factory !== 'service') {
      this.props.closeUpdateMenu();
    }
    let order_data_for_popup = await getClientDateForPopup(selectedProcess.proccess.order_id);
    if (order_data_for_popup.ok) {
      if (order_process && this.props.login.user.type_of_factory === 'service') {
        this.props.setOrderProcessForReservationPopup(order_process);
      }
      this.props.setOrderDataForPopup(order_data_for_popup.result);
      this.props.setOrderIdForPopup(selectedProcess.proccess.order_id);
      if (this.props.login.user.type_of_factory !== 'service') {
        this.props.showMainPopup(true);
      } else {
        this.props.showOrderPopup(true);
      }
    } else {
      console.log('לא ניתן לעדכן הזמנה זו');
    }
  };

  handleTextAreaFocus = () => {
    if (CheckMobileOrTablet()) this.setState({ transformTextArea: true });
  };

  // ----------mobile pop up -----------------------------------------------------------

  selectSystemHandlerMobile = (item) => {
    const { _id, layer, parent_system_id } = item;
    const { systemLayers } = this.state;
    const currentLayer = systemLayers.find((i) => i.layer === layer);
    const siblingSystems =
      currentLayer?.systems.find((i) => i.parent_system_id === parent_system_id) || null;
    const system = siblingSystems && siblingSystems?.systems.find((i) => i._id === _id);
    const checkList = (system && system?.check_list) || null;
    this.setState({ systemChecklistSection: checkList, isCheckListShown: true });
  };

  getAllOrderSystemsList = async (orderId) => {
    this.setState({ isSystemsListLoading: true });
    const { result } = (await getOrderSystemsList(orderId)) || [];
    this.setState({ systemLayers: result, selectedSystemId: null, isSystemsListLoading: false });
  };

  setSystemsChecklistViewable = () => {
    this.setState((state) => {
      return { isCheckListShown: !state.isCheckListShown };
    });
  };

  openAddSystemPopUpHandler = () => {
    this.setState((i) => {
      return { isAddActualSystemPopUPShown: !i.isAddActualSystemPopUPShown };
    });
  };

  openUpdateSystemPopUpHandler = () => {
    this.setState((i) => {
      return { isEditActualSystemPopUpShown: !i.isEditActualSystemPopUpShown };
    });
  };

  editActualSystemHandler = async (e, data) => {
    e.stopPropagation();
    const { customer_id, current_order_id } = this.state;
    data.customer_id = customer_id;
    data.order_id = current_order_id;
    this.setState({
      isEditActualSystemPopUpShown: !this.state.isEditActualSystemPopUpShown,
      selectedSystemForEdit: data,
    });
  };

  editTasksList = (data) => {
    this.setState({ tasks: data, newTask: null });
  };

  createTask = () => {
    const newTask = {
      temporarilyId: uuid(),
      description: '',
      due_date: new Date(),
      resource: '',
      is_done: false,
    };
    this.setState({ newTask });
  };

  showAttachmentsHandler = () => {
    this.setState((state) => ({
      isAttachmentsListShown: !state.isAttachmentsListShown,
      isDigitalSignatureOpen: false,
    }));
  };

  closeAttachmentsHandler = () => {
    this.setState({ isAttachmentsListShown: false });
  };

  showDigitalSignatureHandler = () => {
    this.setState((state) => ({
      isDigitalSignatureOpen: !state.isDigitalSignatureOpen,
      isAttachmentsListShown: false,
    }));
  };

  splitProcessHandler = () => {
    this.setState((state) => ({ splitProcess: !state.splitProcess }));
  };

  setTasksShown = () => {
    this.setState((state) => ({ doTasksShown: !state.doTasksShown }));
  };

  updateProcessPopupStateHandler = (newStateObject, cb) => {
    this.setState({ ...this.state, ...newStateObject }, () => typeof cb === 'function' && cb());
  };

  updateSystemDuration = ({ duration, start_time }) => {
    this.setState({ ...this.state, actualDuration: duration, startTime: start_time });
  };

  render() {
    const { selectedProcess, closeUpdateMenu } = this.props;
    const { loading: loading_btn } = this.props.monthResource;
    let { isDateReadOnly, original_date } = this.state;
    const {
      startDate,
      endDate,
      reportDone,
      finished,
      locked,
      lockpopup,
      load_button,
      resourcesList,
      resourcesLoader,
      show_date_loader,
      backlog,
      transformTextArea,
      isService,
      isMetalpressDoors,
      isDemo,
      isCochav,
      systemChecklistSection,
      isCheckListShown,
      customer_id,
      current_order_id,
      isMobile,
      isTablet,
      selectedSystemId /* if shown sub systems - settled parent system id,else if systems list displayed - null */,
      newTask,
      isAttachmentsListShown,
      splitProcess,
      tasks,
      quantity,
      remark,
      actualDuration,
      startTime,
      currentLayer,
      systemLayers,
      isDigitalSignatureOpen,
    } = this.state;
    let excludedHolidays = this.props.holidays
      ? this.props.holidays.filter((item) => {
          return item.status === 'Day Off';
        })
      : [];
    excludedHolidays = excludedHolidays.map((item) => new Date(item.date));
    let disableDrag =
      this.props.login &&
      Object.keys(this.props.login.user).length > 0 &&
      (this.props.login.user.privileges.includes(PER_USER) ||
        this.props.login.user.privileges.includes(VIEW_ONLY))
        ? true
        : false;

    return !isService ? (
      <div className="custom__popup">
        <aside className="custom__popup__curtain"></aside>

        <form
          style={
            transformTextArea
              ? {
                  transform: 'translateY(-200px)',
                  transition: 'transform .2s',
                  paddingBottom: '20px',
                }
              : { transition: 'transform .2s', paddingBottom: '20px' }
          }
          className="custom__popup__update"
          onSubmit={(e) => {
            this.submit(e);
          }}
        >
          {lockpopup ? (
            <div className="custom__popup__locked-popup">
              <section className="custom__popup__update__submit-section">
                <div>שחרור נעילה הוא הליך בלתי הפיך, האם הינך בטוח שברצונך לשחרר נעילה?</div>
                <div>
                  <button
                    onClick={() => {
                      this.closeLockPopup();
                    }}
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => {
                      this.setState({ locked: false });
                      this.closeLockPopup();
                    }}
                  >
                    אישור
                  </button>
                </div>
              </section>
            </div>
          ) : null}

          <section className="custom__popup__update--first-section">
            <h1 className="custom__popup__update__header">
              {selectedProcess.proccess.process_name}
              {locked && !selectedProcess.proccess.constant ? (
                <img
                  style={disableDrag ? { cursor: 'inherit' } : { cursor: 'pointer' }}
                  onClick={() => {
                    if (disableDrag) {
                      return;
                    } else {
                      this.openLockPopup();
                    }
                  }}
                  src={closedLock}
                  alt="lock"
                />
              ) : !locked && !selectedProcess.proccess.constant ? (
                <img style={{ transform: 'scale(1.8)' }} src={openLock} alt="lock" />
              ) : null}
            </h1>

            <h2
              className="custom__popup__update__client-data"
              onClick={() => {
                this.openReservationPopup();
              }}
              style={{ bottom: isMobile || isTablet ? '80px' : '' }}
            >
              {isMobile ? null : <span>{selectedProcess.client_name}</span>}
              {isMobile ? null : <span> &nbsp; - &nbsp;</span>}
              <span>{selectedProcess.order_number}</span>
            </h2>

            <MultiSelectDropDown
              resourcesLoader={resourcesLoader}
              resourcesList={resourcesList}
              updateProcessPopupStateHandler={this.updateProcessPopupStateHandler}
              disableDrag={disableDrag}
              proccess={selectedProcess.proccess}
            />

            <section className="custom__popup__update__data-section">
              <span className="custom__popup__update__data-section__first-row">
                <p>כמות שהוזמנה:</p>
                <p>{quantity}</p>
              </span>
              <span className="custom__popup__update__data-section__second-row">
                <p>כמות שדווחה:</p>

                <aside
                  className="custom__popup__update__data-section__input-controllers"
                  onClick={() => {
                    this.decrementProcess();
                  }}
                >
                  -
                </aside>
                <input
                  type="number"
                  value={finished}
                  onChange={(e) => {
                    this.handleQuantityChange(e);
                  }}
                  onFocus={(e) => {
                    this.handleFocus(e);
                  }}
                  onBlur={(e) => {
                    this.handleBlur(e);
                  }}
                />
                <aside
                  className="custom__popup__update__data-section__input-controllers"
                  onClick={() => {
                    this.incrementProcess();
                  }}
                >
                  +
                </aside>

                <figure className="custom__popup__update__data-section__second-row--filler"></figure>

                <ProcessStatusReport
                  finished={this.state.finished}
                  quantity={quantity}
                  cancelDoneHandler={this.cancelDone}
                  reportDone={reportDone}
                  reportDoneHandler={this.reportDone}
                />
                <DescriptionIcon
                  style={styles.styledShowAttachmentsIconNotMetalpress}
                  onClick={this.showAttachmentsHandler}
                />
                <GoogleMap process={selectedProcess} />
                <DigitalSignatureBtn clickHandler={this.showDigitalSignatureHandler} />
              </span>

              {!this.props.sendBackToProduction && !selectedProcess.proccess.done ? (
                <div className="completions__checkbox">
                  <CustomCheckbox
                    checked={backlog}
                    size="small"
                    value="small"
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    value="checkedI"
                    onChange={() => {
                      this.handleCompletionsCheckbox();
                    }}
                  />
                  <p>שלח להשלמות</p>
                  {isMetalpressDoors || isDemo ? (
                    <React.Fragment>
                      <CustomCheckbox
                        checked={splitProcess}
                        size="small"
                        value="small"
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        onChange={this.splitProcessHandler}
                      />
                      <p>{SPLIT_PROCESS}</p>
                    </React.Fragment>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="custom__popup__update__form-group">
              <div className="custom__popup__update__form-group--column">
                <label>תאריך התחלה</label>
                <aside className="custom__popup__update__form-group--column--date">
                  <h4>{original_date ? moment(original_date).format('DD/MM/YY') : ''}</h4>
                  <img src={DateImg} alt="date" />
                </aside>

                <DatePicker
                  readOnly={false}
                  selected={original_date ? original_date : moment().toDate()}
                  onChange={this.handleStartDateChange}
                  locale={he}
                  filterDate={this.filterDate}
                  excludeDates={excludedHolidays}
                  disabled={disableDrag}
                  onFocus={() => {
                    this.handleTextAreaFocus();
                  }}
                  onBlur={() => {
                    this.setState({ transformTextArea: false });
                  }}
                />
              </div>

              <div className="custom__popup__update__form-group--column">
                <label>תאריך סיום</label>
                <aside className="custom__popup__update__form-group--column--date">
                  <h4>
                    {show_date_loader ? (
                      <Loader
                        style={{
                          transform: 'scale(0.4)',
                          position: 'relative',
                          height: '20px',
                          right: '43px',
                        }}
                      />
                    ) : endDate ? (
                      moment(endDate).format('DD/MM/YY')
                    ) : (
                      ''
                    )}
                  </h4>
                  <img src={DateImg} alt="date" />
                </aside>

                <DatePicker
                  selected={endDate ? endDate : moment().toDate()}
                  onChange={this.handleEndDateChange}
                  locale={he}
                  filterDate={this.filterDate}
                  excludeDates={excludedHolidays}
                  disabled={disableDrag}
                  minDate={moment(startDate).toDate()}
                  onFocus={() => {
                    this.handleTextAreaFocus();
                  }}
                  onBlur={() => {
                    this.setState({ transformTextArea: false });
                  }}
                />
              </div>
            </section>
            <StartAndEndTimeSection
              duration={selectedProcess.proccess.initial_duration}
              processStartTime={startTime}
              updateProcessPopupStateHandler={this.updateProcessPopupStateHandler}
              resourcesQuntity={this.state.resourcesQuntity}
              selectedProcess={selectedProcess}
            />
            {isCochav ? (
              <TextRemark
                value={remark}
                changeHandler={this.updateProcessPopupStateHandler}
                label={REMARK}
              />
            ) : null}
            {isMobile ? (
              <h3 onClick={this.createTask} className="create_task_link">
                {CREATE_TASK}
              </h3>
            ) : null}
          </section>

          <section
            className="custom__popup__update--second-section"
            style={isMobile || isTablet ? { height: 'auto', marginTop: '10px' } : {}}
          >
            {isAttachmentsListShown ? (
              <Attachments
                customerId={this.props.selectedProcess.proccess.customer_id}
                isOpen={isAttachmentsListShown}
                closeHandler={this.closeAttachmentsHandler}
              />
            ) : isDigitalSignatureOpen ? (
              <DigitalSignature
                closeHandler={this.showDigitalSignatureHandler}
                orderId={current_order_id}
              />
            ) : (
              <OrderTasks
                editTasksList={this.editTasksList}
                orderProcess={this.props.selectedProcess.proccess}
                resources={this.props.resources.resourcesList}
                newTask={newTask}
                tasksFromFormBody={tasks}
                actualDuration={actualDuration}
                startTime={startTime}
                updateProcessPopupStateHandler={this.updateProcessPopupStateHandler}
              />
            )}
            <SubmitSectionNotMetalpress
              closeMenu={closeUpdateMenu}
              submitForm={this.submitForm}
              Loader={Loader}
              load_button={load_button}
              isMobile={isMobile}
              createTask={this.createTask}
            />
          </section>
        </form>
      </div>
    ) : (
      //  if Metalpress
      <ReviewPopup
        customerId={customer_id}
        openReservationPopupHandler={this.openReservationPopup}
        closeHandler={closeUpdateMenu}
        selectedProcess={selectedProcess}
        submitForm={this.submitForm}
        actualDuration={actualDuration}
        processStartTime={startTime}
        resourcesQuntity={this.state.resourcesQuntity}
        loading={load_button}
        // tasks
        createTaskHandler={this.createTask}
        orderTasksProps={{
          editTasksList: this.editTasksList,
          orderProcess: selectedProcess.proccess,
          resources: this.props.resources.resourcesList,
          newTask,
          tasksFromFormBody: tasks,
          actualDuration: actualDuration,
          startTime: startTime,
          updateProcessPopupStateHandler: this.updateProcessPopupStateHandler,
        }}
        systemsProps={{
          selectSystemHandler: this.selectSystemHandlerMobile,
          editSystemHandler: this.editActualSystemHandler,
          currentOrderId: current_order_id,
          selectedSystemId: selectedSystemId,
          currentLayer: currentLayer,
          updateProcessPopupStateHandler: this.updateProcessPopupStateHandler,
          systemLayers: systemLayers,
        }}
        techniciansProps={{
          resourcesLoader: resourcesLoader,
          techniciansList: resourcesList,
          updateProcessPopupStateHandler: this.updateProcessPopupStateHandler,
        }}
        isCheckListShown={isCheckListShown}
        checkListProps={{
          systemsCheckListData: systemChecklistSection,
          updateProcessPopupStateHandler: this.updateProcessPopupStateHandler,
          setSystemsChecklistViewable: this.setSystemsChecklistViewable,
          updateSystems: this.updateSystems,
          selectedSystemId: selectedSystemId,
          layer: currentLayer,
        }}
        openFrom={this.openFrom}
        setSystemDurationData={this.updateSystemDuration}
      />
    );
  }
}

function mapStateToProps({ login, resources, monthResource }) {
  return { login, resources, monthResource };
}

export default withRouter(connect(mapStateToProps, actions)(UpdateProccessPopup));
