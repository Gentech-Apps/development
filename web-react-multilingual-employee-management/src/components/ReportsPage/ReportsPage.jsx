import React, { useEffect, useState } from 'react';
import { useStyles } from './styles';
import metallogo from './images/image 1.svg';
import auditSignature from './images/auditSignature.png';
import './style.css';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { PdfService } from './pdfService';
import html2pdf from 'html2pdf.js';

import Paper from '@material-ui/core/Paper';
import { generalGetRequest } from '../../functions/api/general';
import Loader from '../LoaderNew/Loader';
import html2PDF from 'jspdf-html2canvas';
import { relativeTimeRounding } from 'moment';
import { BorderLeft, BorderVertical } from '@material-ui/icons';
import {
  CHECKED_BOX_URL,
  SECOND_IMAGE_HEADER,
  FIRST_HEADER_IMAGE,
  UNCHECKED_BOX_URL,
  HR_LINE,
  HR_BASE_LINE,
  FACTORY,
} from '../../constants/tasks-report';
import { useSelector } from 'react-redux';

function createDoc(dynamic_id) {
  let css_data = [];
  let id_data = ``;
  Promise.all(
    dynamic_id.map((item) => {
      id_data += `
        #${item.className}{
                        mso-rotate: -90;
                        height: ${item.height};
                    }`;

      css_data.push({ ...item });
    }),
  );
  const docStyle = {
    fontFamily: 'Rubik',
    fontSize: '16px',
  };
  const documentTitle = 'CustomerReports';
  var header = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns='http://www.w3.org/TR/REC-html40'>
    <head><style>
    body{
        direction: rtl;
        width: 100%;
    }
    @page Section {
        size:8.5in 11.0in; 
        margin:0.5in 0.5in 0.5in 0.5in;
        mso-paper-source:0;
    }
    div.Section {
        page: Section;
    }
    .docsContentElement{
        height: auto;
    }
    #report_Node_First{
        display: -webkit-flex;
        webkit-justify-content: space-between;
        height: 100px;
        margin-top: 20px;
    }
    .right_header_text {
        font-family: ${docStyle.fontFamily};
        font-size: ${docStyle.fontSize};
        font-weight: 100;
        line-height: 11px;
    }
    .logo_content_p{text-align: initial;}
    #report_node_f_part_sec{
        width: 50%;
        display: flex;
        justify-content: space-evenly;
        align-items: flex-end;
        flex-direction: column;
    }
    .first_header_1{
        display: flex !important;
        justify-content: space-between;
    }
    .second_para_text{
        font-family: ${docStyle.fontFamily};
        font-size: ${docStyle.fontSize};
    }
    .second_text_bold{
        font-family: ${docStyle.fontFamily};
        font-size: ${docStyle.fontSize};
        font-weight: 500;
        color: #3E4C6A;
        text-align: right;

    }
    .second_para_text_3{
        font-family: ${docStyle.fontFamily};
        font-size: ${docStyle.fontSize};
        color: #3E4C6A;
        font-weight: 500;
    }
    .first_header_hr_1{
        display: block;
        width: 100%;
        height: 3px;
        background: #3E4C6A;
        margin-top: 15px;
    }
    #table-header-color{
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
    }
    .layer_text{

    }
    .under_Logo{
        line-height: 10px;
        font-family: ${docStyle.fontFamily};
        color: #302F2E;
        font-size: ${docStyle.fontSize};
        margin-top: 10px;
        font-weight: 100;
    }
    .audit_Name{
        font-family: ${docStyle.fontFamily};
        font-style: normal;
        font-weight: 600;
        font-size: 32px;
        line-height: 30px;
        text-align: center;
        color: #153F64;
    }
    .Subheader-1{
        font-family: ${docStyle.fontFamily};
        font-size: ${docStyle.fontSize};
    }
    .HeaderText-Head{
        font-family:  ${docStyle.fontFamily};
        font-weight: 600;
        font-size: 24px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 0px;
        text-align: right;
        color: #3E4C6A;
        width: 100%;
    }
    .headerLine{
        height: 2px;
        background: #3E4C6A;
    }
    .firstTable{
        display: table;
        border-spacing: 0;
    }
    .secondTable{
        display: table;
        border-spacing: 0;
    }
    .fourthTable{
        display: table;
        border-spacing: 0;
    }
    #Second_table_header_color{
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
    }
    #un_table_header_row{
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
    }
    #un_table_header_row2{
        color: #fff;
        padding: 0 5px;
        background: #3E4C6A;
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
    }
    #table_header_th1{
        border: 1px solid grey;
    }
    .firstTableCell{
        border: 1px solid grey;
    }
    #third_table_header_row{
        color: #fff;
        padding: 0 5px;
        background: #3E4C6A;
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
    }
    #four_table_head_row{
        color: #fff;
        padding: 0 5px;
        background: #3E4C6A;
        color: #fff;
        padding: 0 5px;
        background: ${ColorByUser.TableBackgroundColor};
        font-family: ${docStyle.fontFamily};
    }
    #vertical_text_dy{
        mso-rotate: -90;
        height: 230px;
    }
    ${id_data}
    </style><meta charset='utf-8'></head><body>`;
  var footer = `</body></html>`;

  let html = header;
  html += document.getElementById('elementDoc').innerHTML;
  html += footer;
  let blob = new Blob(['\ufeff', html], {
    type: 'application/msword',
  });
  let url = URL.createObjectURL(blob);
  let link = document.createElement('A');
  link.href = url;
  link.download = `${documentTitle}.doc`;
  document.body.appendChild(link);
  if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, documentTitle);
  else link.click();
  document.body.removeChild(link);
}

function createPDF() {
  let loading_overlay = document.getElementById('loading-overlay-wrap');
  // show overlay
  loading_overlay.style.display = 'block';
  let element = document.getElementById('elementTOPDF');
  let opt = {
    margin: [1.2, 0.4, 1.2, 0.4],
    filename: 'myreport.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 5, useCORS: true },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };
  let pdf_elements = document.getElementsByClassName('pdf-pages-split');
  let worker = html2pdf().set(opt).from(pdf_elements[0]);

  if (pdf_elements.length > 1) {
    worker = worker.toPdf(); // worker is now a jsPDF instance

    // add each element/page individually to the PDF render process
    for (var i = 1; i < pdf_elements.length; i++) {
      worker = worker
        .get('pdf')
        .then((pdf) => {
          pdf.addPage();
        })
        .from(pdf_elements.item(i))
        .toContainer()
        .toCanvas()
        .toPdf();
    }
  }

  worker = worker.save().then((full) => {
    loading_overlay.style.display = 'none';
  });
}

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const checkStyles = makeStyles((theme) => ({
  t: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const ColorByUser = {
  TableBackgroundColor: '',
  tHBorder: '',
  tDBorder: '',
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    background: ColorByUser.TableBackgroundColor,
    border: '1px lightgrey solid',
    color: theme.palette.common.white,
    borderRadius: '5px',
    borderTopLeftRadius: '10px',
    fontSize: 16,
    fontFamily: 'Rubik',
    padding: '0 5px',
  },
  body: {
    border: '1px #F1F1F1 solid',
    fontSize: 16,
    fontFamily: 'Rubik',
    padding: '0 5px',
    background: '#ffffff',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {},
  },
}))(TableRow);

const styles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ReportsOrders = (props) => {
  const classesCheckbox = checkStyles();
  const [items, setItems] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfPending, setPdfPending] = useState(false);

  const [state, setState] = React.useState({
    checked1: true,
    numberOfGuests: true,
  });

  const [isDoc, setIsDoc] = React.useState(true);
  const isMetalPress = useSelector((state) => state.login.user.factory_id === FACTORY._id);
  const docStyle = {
    fontFamily: 'Rubik',
    fontSize: '16px',
    tableHeaderHeight: '40px',
    borderLeft: '1px lightgrey solid',
    border: '1px #F1F1F1 solid',
    padding: '10px',
  };
  ColorByUser.TableBackgroundColor = isMetalPress ? 'rgb(142,170,219)' : '#3E4C6A';

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const orderUserId = props.match.params.orderId;
  const getReportOrders = async () => {
    setLoading(true);
    const { ok, result } = await generalGetRequest(
      `/system/customer-page/get-report?orderId=${orderUserId}`,
    );

    setItems(result);
    setLoading(false);
  };

  useEffect(() => {
    getReportOrders();
  }, [orderUserId]);

  const checkSystemExists = async (data, fallback, result) => {
    let userSystemExists = [];
    let orderSystemNames = [];
    if (data) {
      data.map((obj) => {
        orderSystemNames.push(obj.system_name);
      });
      for (let i = 0; i <= result.length; i++) {
        if (orderSystemNames.includes(result[i])) {
          userSystemExists.push(result[i]);
        }
      }
    } else {
      return fallback;
    }

    return userSystemExists;
  };

  const checkSystemHasChecklists = (data) => {
    let checklistOfSystems = [];

    if (data) {
      data.map((obj) => {
        if ('check_list' in obj) {
          checklistOfSystems.push(obj);
        }
      });
    } else {
      return false;
    }
    return checklistOfSystems;
  };

  const mapChacklists = (result) => {
    let titleOfCheclistAndValue = [];

    if (result) {
      result.map((obj) => {
        obj.check_list.data.map((dataObject) => {
          titleOfCheclistAndValue.push(dataObject.row_title);
        });
      });
    }
    return titleOfCheclistAndValue;
  };

  const showLayer4Systems = (result) => {
    let systemsOf4Layer = [];

    if (result) {
      result.map((obj) => {
        if (obj.layer == 4) {
          systemsOf4Layer.push(obj);
        }
      });
    }
    return systemsOf4Layer;
  };

  const buildArrayOfSystemsLayer = (data) => {
    let resultArray = [];
    let systemsOf4Layer = [];

    if (data) {
      data.map((obj) => {
        if (obj.layer == 4) {
          systemsOf4Layer.push(obj);
        }
      });
    }
    if (systemsOf4Layer) {
      for (let j = 0; j < systemsOf4Layer.length; j++) {
        let arr = systemsOf4Layer[j].system_name;
        resultArray[j] = {
          names: arr,
        };
        for (let i = 0; i < systemsOf4Layer[j].check_list.data.length; i++) {
          let arrayOfRows = systemsOf4Layer[j].check_list.data[i].row_title;
          resultArray[i] = {
            rows_titles: [arrayOfRows],
          };
        }
      }
    }

    return resultArray;
  };

  function findSystemsId(data) {
    let blowers = [];

    if (data) {
      data.map((obj) => {
        if (obj.template_system_id) {
          blowers.push(obj.template_system_id);
        }
        if (obj.layer === 3 && obj?.child_systems) {
          obj.child_systems.map((child_obj) => {
            child_obj.body.map((child_sub_obj) => {
              blowers.push(child_sub_obj.template_system_id);
            });
          });
        }
      });
    }
    return Array.from(new Set(blowers));
  }

  function showUniquCheclists(data) {
    let result = [];

    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] == '6073df43e206baa7365fcbb9') {
          result.push(1);
        }
        if (data[i] == '6073df54e206baa7365fcbba') {
          result.push(2);
        }
        if (data[i] == '6073df6ee206baa7365fcbbb' || data[i] == '6165d77099c789128fb7f177') {
          result.push(3);
        }
        if (data[i] == '5f6e181008fac40af4cecf15') {
          result.push(4);
        }
        if (
          data[i] == '5f6e181008fac40af4cecf16' ||
          data[i] == '5f6e181008fac40af4cecf17' ||
          data[i] == '5f6e181008fac40af4cecf18' ||
          data[i] == '5f6e181008fac40af4cecf19' ||
          data[i] == '5f6e181008fac40af4cecf1c' ||
          data[i] == '5f6e181008fac40af4cecf1e' ||
          data[i] == '5f6e181008fac40af4cecf1f' ||
          data[i] == '611e2a2ef9eaa88312b53970'
        ) {
          result.push(5);
        }
        if (
          data[i] == '61665b2d99c7897ab8b7f688' ||
          data[i] == '5f6e181008fac40af4cecf1a' ||
          data[i] == '5f6e181008fac40af4cecf1b' ||
          data[i] == '607404ceb97b4f35c3b843b7'
        ) {
          result.push(6);
        }
        if (data[i] == '6076b287f2456c2534825226') {
          result.push(7);
        }
      }
    }
    return Array.from(new Set(result));
  }

  function showFirstLayerSystems(data) {
    let result = [];

    if (data) {
      data.map((obj) => {
        result.push(obj);
      });
    }

    return result;
  }

  function showSystemsName(data) {
    let result = [];

    if (data) {
      data.map((obj) => {
        if (obj.layer == 2 || obj.layer == 3) {
          if (obj.show_stopper !== '') {
            result.push({
              name: obj.system_name,
              stopper: obj.show_stopper,
              actual_system_id: obj.actual_system_id,
              actual_system_name: obj.actual_system_name,
            });
          } else {
            result.push({
              name: obj.system_name,
              stopper: 'תקין‎',
              actual_system_id: obj.actual_system_id,
              actual_system_name: obj.actual_system_name,
            });
          }
        }
      });
    }

    return result;
  }

  function getProperty(data) {
    let result = 0;
    if (data) {
      result = data.title;
      return result;
    }
  }

  function getText(data) {
    let result = 0;
    if (data) {
      result = data.text;
      return result;
    }
  }

  function getResourses(data) {
    let result = [];

    if (data) {
      data.map((obj) => {
        result.push(obj);
      });
    }
    return result;
  }

  function filterFourLayerSystems(data) {
    let filteredSystems = [];

    if (data) {
      data.filter((system) => {
        const { layer, parent_system_id, template_system_id } = system;
        if (
          layer === 4 &&
          parent_system_id === '61c2f7ae4b17043fc474dd1a' &&
          template_system_id === '6073df43e206baa7365fcbb9'
        ) {
          filteredSystems.push(system);
        }
      });
    }
    return filteredSystems;
  }

  //console.log(filterFourLayerSystems(items.systems))

  function showByThirdSystem(data) {
    let filteredSystems = [];

    if (data) {
      data.map((obj) => {
        if (obj.layer === 3) {
          filteredSystems.push(obj);
        }
      });
    }
    return filteredSystems;
  }

  function showByTemplateId(data, arr) {
    let filteredSystems = [];

    if (data) {
      data.map((obj) => {
        if (obj.layer === 4) {
          if (arr.includes(obj.parent_system_id)) {
            filteredSystems.push({
              node: obj.parent_system_id,
              child: obj,
            });
          }
        }
      });
    }
    return filteredSystems;
  }

  function checkEndTime(end_time, start_time = null) {
    if (isNaN(end_time)) {
      return checkStartTime(start_time);
    } else {
      if (parseInt(end_time)) {
        const timeEnd = new Intl.DateTimeFormat('default', {
          hour: '2-digit',
          minute: '2-digit',
          // second: '2-digit'
        }).format(end_time);
        return timeEnd;
      } else {
        // return checkStartTime(start_time)
      }
    }
  }

  function checkStartTime(startTime) {
    if (isNaN(startTime)) {
      return startTime;
    } else {
      if (parseInt(startTime)) {
        const timeStart = new Intl.DateTimeFormat('default', {
          hour: '2-digit',
          minute: '2-digit',
          // second: '2-digit'
        }).format(startTime);
        return timeStart;
      }
      return 'not started';
    }
  }

  let timeEndData = checkEndTime(items.end_time, items.start_time);
  let filteredSystems = filterFourLayerSystems(items.systems);
  //console.log(filteredSystems)
  let systemsWithChecklists = checkSystemHasChecklists(items.systems);
  mapChacklists(systemsWithChecklists);
  let layerFour = showLayer4Systems(items.systems);
  let blowersChecks = findSystemsId(items.systems);
  let uniqueChecklists = showUniquCheclists(blowersChecks);

  let resourses = getResourses(items.resource);
  let firstLayerSystems = showFirstLayerSystems(items.systems);
  let systemsName = showSystemsName(items.systems);

  let summaryData = getProperty(items.summary);
  let summaryText = getText(items.summary);

  /*let startDate = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(items.start_time)*/
  let startDate = checkStartTime(items.start_time);

  const DATE_DUEDATE = new Date(items.due_date);
  const DATE_CREATEDAT = new Date(items.created_at);

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  const classes = useStyles();
  const classesMUI = styles({
    table: {
      minWidth: 800,
    },
  });
  let dynamic_height = 0;
  let dynamic_id = [];
  let docsFire = true;
  const table_gap = [2];
  let count_id = 0;
  let page_count = 0;
  const createDocs = () => {
    let count_id = 0;
    docsFire = false;
    console.log('dynamic_id -: ', dynamic_id);
    document.getElementById('loading-overlay-wrap').style.display = 'block';
    setTimeout(() => {
      setIsDoc(false);
      createDoc(dynamic_id);
      setIsDoc(true);
      document.getElementById('loading-overlay-wrap').style.display = 'none';
    }, 1000);
  };

  function push(e) {
    e.preventDefault();
    document.getElementById('review data').innerHTML = document.getElementById('Review').value;
    document.getElementById('summary data').innerHTML = document.getElementById('Summary').value;
    document.getElementById('audit data').innerHTML = document.getElementById('Audit').value;
    return false;
  }
  let findings = '',
    action_required = '',
    repaired_on_spot = '',
    is_test_done = '',
    if_any_test_done = '',
    is_test_done_color = '',
    if_all_proper = 'yes';
  return (
    <div>
      {items ? (
        <div className="root pdf_report_page">
          <div class="loading-overlay" id="loading-overlay-wrap">
            <Loader />
          </div>

          <div className={classes.header}>
            <div style={{ backgroundColor: '#153F64', borderRadius: '30px', height: '30px' }}>
              <h1 className={classes.content_h1 + 'content_h1'}>דו"ח לקוח</h1>
            </div>
          </div>
          <div className={classes.pdf_Right_Block_Container}>
            <div className={classes.tools}>
              <div className={`${classes.block2}`}>
                <div style={{ marginLeft: '10px' }}>
                  <div>
                    <h1 className={classes.parafraph}>תוצאות ביקורת</h1>
                    <p>
                      <textarea className={classes.fieldinput} id="Audit" placeholder="הערות‎" />
                    </p>
                  </div>
                  <div>
                    <h1 className={classes.parafraph}>פרטי הביקורת</h1>
                    <p>
                      <textarea className={classes.fieldinput} id="Review" placeholder="הערות‎" />
                    </p>
                  </div>
                  <div>
                    <h1 className={classes.parafraph}>סיכום תוצאות הבדיקות</h1>
                    <p>
                      <textarea className={classes.fieldinput} id="Summary" placeholder="הערות‎" />
                    </p>
                  </div>
                </div>
                <div className={classes.pdf_section_btn}>
                  <button
                    className={classes.btn_save}
                    style={{ backgroundColor: '#6C7389' }}
                    onClick={createDocs}
                  >
                    {pdfPending ? <Loader /> : 'צור DOC'}
                  </button>
                  <button
                    className={classes.btn_save}
                    style={{ backgroundColor: '#6C7389' }}
                    onClick={createPDF}
                  >
                    {pdfPending ? <Loader /> : 'צור PDF'}
                  </button>
                  <button className={classes.btn_save} onClick={push}>
                    שמור‎
                  </button>
                </div>
              </div>
              <div
                className={isDoc ? classes.block1 : 'docsContentElement'}
                style={{ height: '550px', overflow: 'auto' }}
                id="elementDoc"
              >
                <div style={{ width: '100%' }} id="elementTOPDF" className="section">
                  <div class="pdf-pages-split">
                    {isDoc ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          height: '100px',
                          marginTop: '20px',
                        }}
                        className={'report_node'}
                        id="report_Node_First"
                      >
                        <div className={classes.logoContent}>
                          <p>לכבוד</p>
                          <p>{items.contact_person}</p>
                          <p>{items.customer_name}</p>
                          <p style={{ textAlign: 'initial' }}>{items.designation_of_structure}</p>
                          <p>{items.address}</p>
                          <p>{items.city}</p>
                        </div>
                        <div
                          style={{
                            width: '50%',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                          }}
                        >
                          <img src={metallogo} alt="metallogo" />
                          <div className={classes.underLogo}>
                            {DATE_DUEDATE.toLocaleDateString('en-GB')} {items.customer_number}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: 'right' }}>
                              <div className="right_header_text">
                                לכבוד <br />
                                {items.contact_person}
                                {items.contact_person ? <br /> : <></>}
                                {items.customer_name}
                                {items.customer_name ? <br /> : <></>}
                                {items.designation_of_structure}{' '}
                                {items.designation_of_structure ? <br /> : <></>}
                                {items.address}
                                {items.address ? <br /> : <></>}
                                {items.city}
                              </div>
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              <div>
                                <img src={FIRST_HEADER_IMAGE} alt="metallogo" />
                                <div className="under_Logo">
                                  {DATE_DUEDATE.toLocaleDateString('en-GB')} {items.customer_number}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    <div className={`${classes.audit} report_node`}>
                      {isDoc ? (
                        <div
                          className="first_header_1"
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <hr className={classes.hr} />
                          <div className={classes.auditName}>תוצאות ביקורת</div>
                          <hr className={classes.hr} />
                        </div>
                      ) : (
                        <table style={{ width: '100%' }}>
                          <tr>
                            <th>
                              <img src={HR_LINE} />
                            </th>
                            <th>
                              {' '}
                              <div className="audit_Name"> תוצאות ביקורת </div>
                            </th>
                            <th>
                              <img src={HR_LINE} />
                            </th>
                          </tr>
                        </table>
                      )}
                    </div>
                    <div className={`${classes.presentation} report_node`}>
                      <p
                        className={isDoc ? '' : 'second_para_text'}
                        style={isDoc ? {} : { margin: '0' }}
                      >
                        {items.contact_person} שלום רב,
                      </p>
                      <p
                        className={isDoc ? '' : 'second_para_text'}
                        style={{
                          marginTop: isDoc ? '10px' : '',
                        }}
                      >
                        אנו מתכבדים להגיש לך את תוצאות הביקורת שנערכה ב
                        <span> {DATE_DUEDATE.toLocaleDateString('en-GB')} </span>
                      </p>

                      <div className={classes.presentation}>
                        <p
                          style={{
                            fontWeight: '600',
                            color: '#3E4C6A',
                            backgroundColor: '3E4C6A',
                            marginTop: '10px',
                          }}
                          className={isDoc ? '' : 'second_para_text_3'}
                        >
                          {summaryData}
                        </p>
                        <p
                          style={{ marginTop: '20px' }}
                          className={isDoc ? '' : 'second_para_text'}
                        >
                          {summaryText}
                        </p>
                      </div>
                      <p style={{ marginTop: '10px' }} className={isDoc ? '' : 'second_para_text'}>
                        {' '}
                        בברכה,{' '}
                      </p>
                      {isDoc ? (
                        <h1 style={{ marginTop: '10px' }}>נעמן האוספאטר</h1>
                      ) : (
                        <p className="Subheader-1">נעמן האוספאטר</p>
                      )}
                      <div style={{ textAlign: 'left', width: '100%' }}>
                        <img
                          style={{ marginTop: '10px' }}
                          src={isDoc ? auditSignature : SECOND_IMAGE_HEADER}
                          alt="auditSignature"
                        />
                      </div>

                      <p
                        id="audit data"
                        style={
                          isDoc
                            ? {
                                border: '0',
                                textAlign: 'right',
                                float: 'right',
                                marginTop: '20px',
                                marginBottom: '20px',
                                width: '650px',
                                background: '#FFFFFF',
                                fontFamily: 'Rubik',
                                fontSize: '16px',
                              }
                            : {
                                textAlign: 'right',
                                float: 'right',
                                marginTop: '20px',
                                marginBottom: '20px',
                                width: '650px',
                                background: '#FFFFFF',
                                fontFamily: docStyle.fontFamily,
                                fontSize: docStyle.fontSize,
                                fontWeight: '100',
                              }
                        }
                      ></p>
                    </div>
                    <div
                      className={`${classes.reviewDetails} report_node`}
                      style={{ marginTop: '80px', clear: 'both' }}
                    >
                      <h1 className={isDoc ? classes.headerText : 'HeaderText-Head'}>
                        פרטי הביקורת
                      </h1>
                      {isDoc ? <hr className={classes.headerLine} /> : <img src={HR_BASE_LINE} />}
                      <div className={isDoc ? `${classes.presentation}` : 'second_para_text'}>
                        <p style={isDoc ? {} : { margin: '0' }}>
                          {' '}
                          ביקורת נערכה ב {items.address} {items.city} , ביום{' '}
                          {DATE_DUEDATE.toLocaleDateString('en-GB')} בין השעות {startDate} -{' '}
                          {timeEndData !== undefined && `${timeEndData}`}
                        </p>
                        <p style={isDoc ? {} : { margin: '0' }}>
                          {' '}
                          הביקורת בוצעה על ידי {resourses.join()}{' '}
                        </p>

                        <p
                          id="review data"
                          style={
                            isDoc
                              ? {
                                  border: '0',
                                  textAlign: 'right',
                                  float: 'right',
                                  marginTop: '20px',
                                  marginBottom: '20px',
                                  width: '650px',
                                  background: '#FFFFFF',
                                  fontFamily: 'Rubik',
                                  fontSize: '16px',
                                }
                              : {
                                  textAlign: 'right',
                                  float: 'right',
                                  marginTop: '20px',
                                  marginBottom: '20px',
                                  width: '650px',
                                  background: '#FFFFFF',
                                  fontFamily: docStyle.fontFamily,
                                  fontSize: docStyle.fontSize,
                                  fontWeight: '100',
                                }
                          }
                        ></p>
                      </div>
                    </div>
                    {systemsName.length > 0 && <div class="html2pdf__page-break"></div>}
                    <div
                      className={`${classes.reviewDetails} report_node`}
                      style={{
                        marginBottom: '10px',
                        marginTop: isDoc ? '80px' : '70px',
                        clear: 'both',
                      }}
                    >
                      <h1 className={isDoc ? classes.headerText : 'HeaderText-Head'}>
                        {' '}
                        סיכום תוצאות הבדיקות
                      </h1>
                      {isDoc ? <hr className={classes.headerLine} /> : <img src={HR_BASE_LINE} />}
                      <TableContainer component={Paper}>
                        <Table
                          className={isDoc ? classesMUI.table : 'firstTable'}
                          aria-label="customized table"
                          style={isDoc ? {} : { borderCollapse: 'collapse', width: '100%' }}
                        >
                          <TableHead>
                            <TableRow id={isDoc ? '' : 'table-header-color'}>
                              <StyledTableCell
                                align="right"
                                style={{
                                  borderRadius: '0',
                                  borderTopLeftRadius: '0',
                                  textAlign: 'right',
                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                  fontWeight: isDoc ? '' : '600',
                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                }}
                              >
                                מערכת{' '}
                              </StyledTableCell>
                              <StyledTableCell
                                align="right"
                                style={{
                                  borderRadius: '0',
                                  borderTopLeftRadius: '0',
                                  textAlign: 'right',
                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                  fontWeight: isDoc ? '' : '600',
                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                }}
                              >
                                תוצאה
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {systemsName.map((obj) => (
                              <StyledTableRow key={obj.actual_system_id}>
                                <StyledTableCell
                                  component="th"
                                  scope="row"
                                  align="right"
                                  style={{
                                    textAlign: 'right',
                                    border: isDoc ? '' : docStyle.border,
                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                    fontWeight: isDoc ? '' : '100',
                                    padding: isDoc ? '' : '5px',
                                  }}
                                >
                                  {obj.name} {obj.actual_system_name}
                                </StyledTableCell>
                                <StyledTableCell
                                  align="right"
                                  style={{
                                    textAlign: 'right',
                                    border: isDoc ? '' : docStyle.border,
                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                    fontWeight: isDoc ? '' : '100',
                                    padding: isDoc ? '' : '5px',
                                  }}
                                >
                                  {obj.stopper}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <div>
                        <p
                          id="summary data"
                          style={
                            isDoc
                              ? {
                                  border: '0',
                                  textAlign: 'right',
                                  float: 'right',
                                  marginTop: '20px',
                                  marginBottom: '20px',
                                  width: '650px',
                                  background: '#FFFFFF',
                                  fontFamily: 'Rubik',
                                  fontSize: '16px',
                                }
                              : {
                                  textAlign: 'right',
                                  float: 'right',
                                  marginTop: '20px',
                                  marginBottom: '20px',
                                  width: '650px',
                                  background: '#FFFFFF',
                                  fontFamily: docStyle.fontFamily,
                                  fontSize: docStyle.fontSize,
                                  fontWeight: '100',
                                }
                          }
                          disabled
                          value=""
                        ></p>
                      </div>
                    </div>
                    <div class="html2pdf__page-break"></div>

                    <div className={classes.reviewDetails} style={{ clear: 'both' }}>
                      <h1
                        className={isDoc ? classes.headerText + ' report_node' : 'HeaderText-Head'}
                        style={!isDoc ? { marginTop: '20px' } : {}}
                      >
                        בדיקות תקינות
                      </h1>
                      {isDoc ? <hr className={classes.headerLine} /> : <img src={HR_BASE_LINE} />}
                      <div
                        className={
                          isDoc ? `${classes.presentation} report_node` : 'second_para_text'
                        }
                      >
                        מטאלפרס מבצעת בדיקות תקינות למערכות אוורור, ניהול עשן ו-CO כנדרש בתקן,
                        ומנפיקה אישורי תקינות המוכרים
                      </div>
                      {uniqueChecklists.map((idx) => {
                        if (idx === 1) {
                          return (
                            <div key={idx} className={'report_node'}>
                              {isDoc ? null : (
                                <div>
                                  <br />
                                </div>
                              )}
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                מפוחים
                              </h1>
                              <div className={classesCheckbox.root}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="שלמות המפוחים, ברגים, קופסת חיבורים, צבע/חלודה"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="שלמות חיבור בין תעלות/פיר/גמישים, תקינות הארקה"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color={isDoc ? 'primary' : '#3f51b5'}
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הפעלה ידנית לכל מפוח"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="רעידות ורעשים חריגים מהמפוח, כיוון סיבוב, ספיקה, זרמי מנועי"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הפעלה: תריסי אל חוזר, משתיקי קול (אם יש"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הינע רצועה (אם יש)"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        שלמות המפוחים, ברגים, קופסת חיבורים, צבע/חלודה
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        שלמות חיבור בין תעלות/פיר/גמישים, תקינות הארקה
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>הפעלה ידנית לכל מפוח</td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        רעידות ורעשים חריגים מהמפוח, כיוון סיבוב, ספיקה, זרמי מנועי
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        הפעלה: תריסי אל חוזר, משתיקי קול (אם יש
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>הינע רצועה (אם יש)</td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 2) {
                          return (
                            <div key={idx} className={'report_node'}>
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                מדפי אש/עשן
                              </h1>
                              <div className={classesCheckbox.root}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="שלמות הציוד: קפיצים, נתיכים, להבים, מוטות מקשרים"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="אפיון מתח מנוע מתוכנן, בדיקת מתח זינה, תקינות התקנה"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="שלמות ותפקוד המנוע, פתיחה וסגירה"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="פתיחה וסגירה מלאה של המדף (לא חוזר?)"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        שלמות הציוד: קפיצים, נתיכים, להבים, מוטות מקשרים
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        אפיון מתח מנוע מתוכנן, בדיקת מתח זינה, תקינות התקנה
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        למות ותפקוד המנוע, פתיחה וסגירה
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        פתיחה וסגירה מלאה של המדף (לא חוזר?)
                                      </td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 3) {
                          return (
                            <div key={idx} className={'report_node'}>
                              {isDoc ? null : (
                                <div>
                                  <br />
                                </div>
                              )}
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                לוחות חשמל
                              </h1>
                              <div className={classesCheckbox.root}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="בדיקה ויזואלית"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="תקינות מתח, הארקה, מוליכים, פיקוד (מול מערכות חיצוניות)"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>בדיקה ויזואלית</td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        תקינות מתח, הארקה, מוליכים, פיקוד (מול מערכות חיצוניות)
                                      </td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}{' '}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 4) {
                          return (
                            <div key={idx} className={'report_node'}>
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                דיחוס חדרי מדרגות
                              </h1>
                              <div className={isDoc ? classesCheckbox.root : 'second_para_text'}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="בדיקה פיקודית מלוח חשמל, גילוי אש, הפעלת פנל כבאים (ידני)"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="סגירת מדפים"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="רגשי לחץ, מפוחים, מדפים"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="מערכת על-לחץ ורגשי לחץ (מדגמית בשלוש דלתות)"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        בדיקה פיקודית מלוח חשמל, גילוי אש, הפעלת פנל כבאים (ידני)
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>סגירת מדפים"</td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        רגשי לחץ, מפוחים, מדפים
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ paddingRight: '10px' }}>
                                        מערכת על-לחץ ורגשי לחץ (מדגמית בשלוש דלתות)
                                      </td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}{' '}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 5) {
                          return (
                            <div key={idx} className={'report_node'}>
                              {isDoc ? null : (
                                <div>
                                  <br />
                                </div>
                              )}
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                מערכת שחרור עשן{' '}
                              </h1>
                              <div
                                className={classes.descriptionText}
                                style={
                                  isDoc
                                    ? { marginTop: '10px', marginRight: '20px' }
                                    : {
                                        marginTop: '10px',
                                        marginRight: '20px',
                                        color: '#3E4C6A',
                                        fontFamily: docStyle.fontFamily,
                                      }
                                }
                              >
                                מבואות, יניקה מאטריום, מחסנים, חדרים טכניים, חדרי אשפה קומתיים,
                                דחסנית, חניון
                              </div>
                              <div
                                className={isDoc ? classesCheckbox.root : 'second_para_text'}
                                style={{ width: isDoc ? '80%' : '100%', marginTop: '10px' }}
                              >
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הפעלה על ידי גילוי אש, פנל כבאים (בדיקת רכזת גילוי אש בנוכחות חשמלאי מורשה),  שעון שבת"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="ספיקה של תריסי יניקה מבואות, אטריום, לובי קומתי, חניון (מדגמית)"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="מהירות זרימת אוויר בכניסות אוויר (אטריום)"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="מפוחים, מדפים"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        הפעלה על ידי גילוי אש, פנל כבאים (בדיקת רכזת גילוי אש
                                        בנוכחות חשמלאי מורשה), שעון שבת
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        ספיקה של תריסי יניקה מבואות, אטריום, לובי קומתי, חניון
                                        (מדגמית)
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        מהירות זרימת אוויר בכניסות אוויר (אטריום)
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ paddingRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>מפוחים, מדפים</td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}{' '}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 6) {
                          return (
                            <div key={idx} className={'report_node'}>
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                מערכת אוורור ויניקה
                              </h1>
                              <div
                                className={classes.descriptionText}
                                style={{ marginTop: '10px', marginRight: '20px' }}
                              >
                                שירותים, מטבחים, מייבשים (מערכת ראשית בלבד, ללא דירות)
                              </div>
                              <div className={classesCheckbox.root}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הפעלה על ידי גילוי אש, פנל כבאים (בדיקת רכזת גילוי אש בנוכחות חשמלאי מורשה),  שעון שבת"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="מפוחים, מדפים"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        הפעלה על ידי גילוי אש, פנל כבאים (בדיקת רכזת גילוי אש
                                        בנוכחות חשמלאי מורשה), שעון שבת
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>מפוחים, מדפים</td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}{' '}
                      {uniqueChecklists.map((idx) => {
                        if (idx === 7) {
                          return (
                            <div key={idx} className={'report_node'}>
                              {isDoc ? null : (
                                <div>
                                  <br />
                                </div>
                              )}
                              <h1
                                className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                style={{ color: 'black', marginRight: '20px' }}
                              >
                                בדיקת מערכת CO
                              </h1>
                              <div className={classesCheckbox.root}>
                                {isDoc ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="החלפת סוללות במערכת אלחוטית (שנתית)"
                                    />
                                    {isDoc ? '' : <br />}
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="בדיקת הרכזת, תקינות, כיול רגשים"
                                    />
                                    {isDoc ? '' : <br />}
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="תקשורת בין הרגשים לרכזת, כבילה בין רכזת ללוח"
                                    />
                                    {isDoc ? '' : <br />}
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={state.checked1}
                                          onChange={handleChange}
                                          name="checkedA"
                                          color="primary"
                                          style={{ padding: '2px 9px' }}
                                        />
                                      }
                                      label="הוצאת דוחות מרכזת CO (אם ניתן)"
                                    />
                                  </FormGroup>
                                ) : (
                                  <table style={{ marginTop: '5px' }}>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        החלפת סוללות במערכת אלחוטית (שנתית)
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        בדיקת הרכזת, תקינות, כיול רגשים
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        תקשורת בין הרגשים לרכזת, כבילה בין רכזת ללוח
                                      </td>
                                    </tr>
                                    <tr className="second_para_text">
                                      <td style={{ marginRight: '20px' }}>
                                        <img
                                          src={state.checked1 ? CHECKED_BOX_URL : UNCHECKED_BOX_URL}
                                        />
                                      </td>
                                      <td style={{ marginRight: '10px' }}>
                                        הוצאת דוחות מרכזת CO (אם ניתן)
                                      </td>
                                    </tr>
                                  </table>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div class="html2pdf__page-break"></div>
                  <div class="pdf-pages-split2">
                    <div className={classes.reviewDetails}>
                      {firstLayerSystems.map((i, idx) => {
                        idx = idx + 1;
                        return (
                          <div key={idx}>
                            {i.layer === 2 && (
                              <div class="pdf-pages-split">
                                {idx === 1 && (
                                  <div
                                    className="layers_heading"
                                    style={!isDoc ? { marginTop: '60px' } : {}}
                                  >
                                    <h1 className={isDoc ? classes.headerText : 'HeaderText-Head'}>
                                      {' '}
                                      דו"ח בדיקה מלא
                                    </h1>
                                    {isDoc ? (
                                      <hr className={classes.headerLine} />
                                    ) : (
                                      <img src={HR_BASE_LINE} />
                                    )}
                                  </div>
                                )}
                                {firstLayerSystems[idx - 1].layer === 1 && (
                                  <div className="first_layer">
                                    <h1
                                      className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                      style={{ color: 'black' }}
                                    >
                                      <span> {firstLayerSystems[idx - 1].system_name} &nbsp;</span>
                                      {firstLayerSystems[idx - 1].actual_system_name && (
                                        <span>
                                          {' '}
                                          {firstLayerSystems[idx - 1].actual_system_name}{' '}
                                        </span>
                                      )}
                                      {firstLayerSystems[idx - 1].location_floor && (
                                        <span> , {firstLayerSystems[idx - 1].location_floor} </span>
                                      )}
                                      {firstLayerSystems[idx - 1].location_description && (
                                        <span>
                                          {' '}
                                          , {firstLayerSystems[idx - 1].location_description}{' '}
                                        </span>
                                      )}
                                      {firstLayerSystems[idx - 1].children_type_and_quantity &&
                                        firstLayerSystems[idx - 1].children_type_and_quantity.map(
                                          (j, value_id) => {
                                            return (
                                              <span key={value_id}>
                                                <span> , {j.name} </span>
                                                <span> : {j.quantity} </span>
                                              </span>
                                            );
                                          },
                                        )}
                                    </h1>
                                  </div>
                                )}

                                <div className="second_layer">
                                  <h1
                                    className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                    style={{ color: 'black' }}
                                  >
                                    <span>{i.system_name} &nbsp;</span>
                                    {i.actual_system_name && <span> {i.actual_system_name} </span>}
                                    {i.location_floor && <span> , {i.location_floor} </span>}
                                    {i.location_description && (
                                      <span> , {i.location_description} </span>
                                    )}
                                    {i.children_type_and_quantity &&
                                      i.children_type_and_quantity.map((j, value_id) => {
                                        return (
                                          <span key={value_id}>
                                            <span> , {j.name} </span>
                                            <span> : {j.quantity} </span>
                                          </span>
                                        );
                                      })}
                                  </h1>
                                  {isDoc ? null : <br />}
                                  {i.check_list && (
                                    <TableContainer
                                      component={Paper}
                                      style={{ marginTop: isDoc ? '20px' : '' }}
                                    >
                                      <Table
                                        className={isDoc ? classesMUI.table : 'secondTable'}
                                        aria-label="customized table"
                                        style={
                                          isDoc ? {} : { borderCollapse: 'collapse', width: '100%' }
                                        }
                                      >
                                        <TableHead>
                                          <TableRow id={isDoc ? '' : 'Second_table_header_color'}>
                                            <StyledTableCell
                                              align="right"
                                              style={{
                                                borderRadius: '0',
                                                borderTopLeftRadius: '0',
                                                textAlign: 'right',
                                                borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                fontSize: isDoc ? '' : docStyle.fontSize,
                                                fontWeight: isDoc ? '' : '600',
                                                height: isDoc ? '' : docStyle.tableHeaderHeight,
                                              }}
                                            >
                                              תיאור בדיקה
                                            </StyledTableCell>
                                            <StyledTableCell
                                              align="right"
                                              style={{
                                                borderRadius: '0',
                                                borderTopLeftRadius: '0',
                                                textAlign: 'right',
                                                borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                fontSize: isDoc ? '' : docStyle.fontSize,
                                                fontWeight: isDoc ? '' : '600',
                                                height: isDoc ? '' : docStyle.tableHeaderHeight,
                                              }}
                                            >
                                              תקין / לא תקין
                                            </StyledTableCell>
                                            <StyledTableCell
                                              align="right"
                                              style={{
                                                borderRadius: '0',
                                                borderTopLeftRadius: '0',
                                                textAlign: 'right',
                                                borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                fontSize: isDoc ? '' : docStyle.fontSize,
                                                fontWeight: isDoc ? '' : '600',
                                                height: isDoc ? '' : docStyle.tableHeaderHeight,
                                              }}
                                            >
                                              סיבת אי תקינות
                                            </StyledTableCell>
                                            <StyledTableCell
                                              align="right"
                                              style={{
                                                borderRadius: '0',
                                                borderTopLeftRadius: '0',
                                                textAlign: 'right',
                                                borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                fontSize: isDoc ? '' : docStyle.fontSize,
                                                fontWeight: isDoc ? '' : '600',
                                                height: isDoc ? '' : docStyle.tableHeaderHeight,
                                              }}
                                            >
                                              פעולה נדרשת
                                            </StyledTableCell>
                                            <StyledTableCell
                                              align="right"
                                              style={{
                                                borderRadius: '0',
                                                borderTopLeftRadius: '0',
                                                textAlign: 'right',
                                                borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                fontSize: isDoc ? '' : docStyle.fontSize,
                                                fontWeight: isDoc ? '' : '600',
                                                height: isDoc ? '' : docStyle.tableHeaderHeight,
                                              }}
                                            >
                                              תוקן במקום
                                            </StyledTableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {i.check_list.data.map((row) => {
                                            return (
                                              <StyledTableRow key={row.row_title}>
                                                <StyledTableCell
                                                  component="th"
                                                  scope="row"
                                                  align="right"
                                                  style={{
                                                    textAlign: 'right',
                                                    border: isDoc ? '' : docStyle.border,
                                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                                    fontWeight: isDoc ? '' : '100',
                                                    padding: isDoc ? '' : '5px',
                                                  }}
                                                >
                                                  {row.row_title}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                  align="right"
                                                  style={{
                                                    textAlign: 'right',
                                                    border: isDoc ? '' : docStyle.border,
                                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                                    fontWeight: isDoc ? '' : '100',
                                                    padding: isDoc ? '' : '5px',
                                                  }}
                                                >
                                                  {row.values[0].value}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                  align="right"
                                                  style={{
                                                    textAlign: 'right',
                                                    border: isDoc ? '' : docStyle.border,
                                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                                    fontWeight: isDoc ? '' : '100',
                                                    padding: isDoc ? '' : '5px',
                                                  }}
                                                >
                                                  {row.values[1].value &&
                                                    row.values[1].value.map(
                                                      (result_value, index) => {
                                                        if (index !== 0) {
                                                          return <p>{result_value}, </p>;
                                                        } else {
                                                          return <p> {result_value}</p>;
                                                        }
                                                      },
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                  align="right"
                                                  style={{
                                                    textAlign: 'right',
                                                    border: isDoc ? '' : docStyle.border,
                                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                                    fontWeight: isDoc ? '' : '100',
                                                    padding: isDoc ? '' : '5px',
                                                  }}
                                                >
                                                  {row.values[2].value &&
                                                    typeof row.values[2].value === 'string' &&
                                                    row.values[2].value
                                                      .split(',')
                                                      .map((result_value, index) => {
                                                        if (index !== row.values[1].value.length) {
                                                          return <p>{result_value}, </p>;
                                                        } else {
                                                          return <p> {result_value}</p>;
                                                        }
                                                      })}
                                                  {row.values[2].value &&
                                                    typeof row.values[2].value === 'object' &&
                                                    row.values[2].value.map(
                                                      (result_value, index) => {
                                                        if (index !== 0) {
                                                          return <p>{result_value}, </p>;
                                                        } else {
                                                          return <p> {result_value}</p>;
                                                        }
                                                      },
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                  align="right"
                                                  style={{
                                                    textAlign: 'right',
                                                    border: isDoc ? '' : docStyle.border,
                                                    fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                    fontSize: isDoc ? '' : docStyle.fontSize,
                                                    fontWeight: isDoc ? '' : '100',
                                                    padding: isDoc ? '' : '5px',
                                                  }}
                                                >
                                                  {row.values[3].value === true ? 'תוקן במקום' : ''}
                                                </StyledTableCell>
                                              </StyledTableRow>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  )}
                                </div>
                              </div>
                            )}
                            {i.layer === 3 && (
                              <div class="pdf-pages-split">
                                <div className="three_layer_three_wrap">
                                  <div
                                    className="three_layer report_node"
                                    style={!isDoc ? { marginTop: '80px' } : {}}
                                  >
                                    <h1
                                      className={isDoc ? classes.headerText : 'HeaderText-Head'}
                                      style={{ color: 'black' }}
                                    >
                                      {i.system_name}
                                    </h1>
                                    {isDoc ? null : <br />}
                                    <div className={classes.presentation}>
                                      <p style={{ fontFamily: isDoc ? '' : docStyle.fontFamily }}>
                                        {i.actual_system_name && (
                                          <span> {i.actual_system_name} </span>
                                        )}
                                        {i.location_floor && <span> , {i.location_floor} </span>}
                                        {i.location_description && (
                                          <span> , {i.location_description} </span>
                                        )}
                                        {i.children_type_and_quantity &&
                                          i.children_type_and_quantity.map((j, value_id) => {
                                            return (
                                              <span key={value_id}>
                                                <span> , {j.name} </span>
                                                <span> : {j.quantity} </span>
                                              </span>
                                            );
                                          })}
                                      </p>
                                    </div>
                                    {i.check_list && (
                                      <TableContainer
                                        component={Paper}
                                        style={{ marginTop: isDoc ? '20px' : '' }}
                                      >
                                        <Table
                                          className={isDoc ? classesMUI.table : 'fourthTable'}
                                          aria-label="customized table"
                                          style={
                                            isDoc
                                              ? {}
                                              : { borderCollapse: 'collapse', width: '100%' }
                                          }
                                        >
                                          <TableHead>
                                            <TableRow id={isDoc ? '' : 'third_table_header_row'}>
                                              <StyledTableCell
                                                align="right"
                                                style={{
                                                  borderRadius: '0',
                                                  borderTopLeftRadius: '0',
                                                  textAlign: 'right',
                                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                                  fontWeight: isDoc ? '' : '600',
                                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                                  padding: isDoc ? '' : '5px',
                                                }}
                                              >
                                                תיאור בדיקה
                                              </StyledTableCell>
                                              <StyledTableCell
                                                align="right"
                                                style={{
                                                  borderRadius: '0',
                                                  borderTopLeftRadius: '0',
                                                  textAlign: 'right',
                                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                                  fontWeight: isDoc ? '' : '600',
                                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                                  padding: isDoc ? '' : '5px',
                                                }}
                                              >
                                                תקין / לא תקין
                                              </StyledTableCell>
                                              <StyledTableCell
                                                align="right"
                                                style={{
                                                  borderRadius: '0',
                                                  borderTopLeftRadius: '0',
                                                  textAlign: 'right',
                                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                                  fontWeight: isDoc ? '' : '600',
                                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                                  padding: isDoc ? '' : '5px',
                                                }}
                                              >
                                                סיבת אי תקינות
                                              </StyledTableCell>
                                              <StyledTableCell
                                                align="right"
                                                style={{
                                                  borderRadius: '0',
                                                  borderTopLeftRadius: '0',
                                                  textAlign: 'right',
                                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                                  fontWeight: isDoc ? '' : '600',
                                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                                  padding: isDoc ? '' : '5px',
                                                }}
                                              >
                                                פעולה נדרשת
                                              </StyledTableCell>
                                              <StyledTableCell
                                                align="right"
                                                style={{
                                                  borderRadius: '0',
                                                  borderTopLeftRadius: '0',
                                                  textAlign: 'right',
                                                  borderLeft: isDoc ? '' : docStyle.borderLeft,
                                                  fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                  fontSize: isDoc ? '' : docStyle.fontSize,
                                                  fontWeight: isDoc ? '' : '600',
                                                  height: isDoc ? '' : docStyle.tableHeaderHeight,
                                                  padding: isDoc ? '' : '5px',
                                                }}
                                              >
                                                תוקן במקום
                                              </StyledTableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {i.check_list.data.map((row) => {
                                              return (
                                                <StyledTableRow key={row.row_title}>
                                                  <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                    align="right"
                                                    style={{
                                                      textAlign: 'right',
                                                      border: isDoc ? '' : docStyle.border,
                                                      fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                      fontSize: isDoc ? '' : docStyle.fontSize,
                                                      fontWeight: isDoc ? '' : '100',
                                                      padding: isDoc ? '' : '5px',
                                                    }}
                                                  >
                                                    {row.row_title}
                                                  </StyledTableCell>
                                                  <StyledTableCell
                                                    align="right"
                                                    style={{
                                                      textAlign: 'right',
                                                      border: isDoc ? '' : docStyle.border,
                                                      fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                      fontSize: isDoc ? '' : docStyle.fontSize,
                                                      fontWeight: isDoc ? '' : '100',
                                                      padding: isDoc ? '' : '5px',
                                                    }}
                                                  >
                                                    {row.values[0].value}
                                                  </StyledTableCell>
                                                  <StyledTableCell
                                                    align="right"
                                                    style={{
                                                      textAlign: 'right',
                                                      border: isDoc ? '' : docStyle.border,
                                                      fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                      fontSize: isDoc ? '' : docStyle.fontSize,
                                                      fontWeight: isDoc ? '' : '100',
                                                      padding: isDoc ? '' : '5px',
                                                    }}
                                                  >
                                                    {row.values[1].value &&
                                                      row.values[1].value.map(
                                                        (result_value, index) => {
                                                          if (
                                                            index !== row.values[1].value.length
                                                          ) {
                                                            return <p>{result_value}, </p>;
                                                          } else {
                                                            return <p> {result_value}</p>;
                                                          }
                                                        },
                                                      )}
                                                  </StyledTableCell>
                                                  <StyledTableCell
                                                    align="right"
                                                    style={{
                                                      textAlign: 'right',
                                                      border: isDoc ? '' : docStyle.border,
                                                      fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                      fontSize: isDoc ? '' : docStyle.fontSize,
                                                      fontWeight: isDoc ? '' : '100',
                                                      padding: isDoc ? '' : '5px',
                                                    }}
                                                  >
                                                    {row.values[2].value &&
                                                      typeof row.values[2].value === 'string' &&
                                                      row.values[2].value
                                                        .split(',')
                                                        .map((result_value, index) => {
                                                          if (
                                                            index !== row.values[1].value.length
                                                          ) {
                                                            return <p>{result_value}, </p>;
                                                          } else {
                                                            return <p> {result_value}</p>;
                                                          }
                                                        })}
                                                    {row.values[2].value &&
                                                      typeof row.values[2].value === 'object' &&
                                                      row.values[2].value.map(
                                                        (result_value, index) => {
                                                          if (
                                                            index !== row.values[2].value.length
                                                          ) {
                                                            return <p>{result_value}, </p>;
                                                          } else {
                                                            return <p> {result_value}</p>;
                                                          }
                                                        },
                                                      )}
                                                  </StyledTableCell>
                                                  <StyledTableCell
                                                    align="right"
                                                    style={{
                                                      textAlign: 'right',
                                                      border: isDoc ? '' : docStyle.border,
                                                      fontFamily: isDoc ? '' : docStyle.fontFamily,
                                                      fontSize: isDoc ? '' : docStyle.fontSize,
                                                      fontWeight: isDoc ? '' : '100',
                                                      padding: isDoc ? '' : '5px',
                                                    }}
                                                  >
                                                    <p>
                                                      {row.values[3].value === true
                                                        ? 'תוקן במקום'
                                                        : ''}
                                                    </p>
                                                  </StyledTableCell>
                                                </StyledTableRow>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    )}
                                    {i.check_list &&
                                      i.check_list.tests_per_floor &&
                                      i.check_list.tests_per_floor.closed_doors_test && (
                                        <div className="three_layer_three_doors_wrap report_node">
                                          <div className="three_layer_closed_doors">
                                            <h1
                                              className={
                                                isDoc ? classes.headerText : 'HeaderText-Head'
                                              }
                                              style={{ color: 'black' }}
                                            >
                                              בדיקת לחצים בדלתות סגורות‎
                                            </h1>
                                            {isDoc ? null : <br />}
                                            <TableContainer component={Paper}>
                                              <Table
                                                className={classesMUI.table}
                                                aria-label="customized table"
                                                style={
                                                  isDoc
                                                    ? { marginTop: '20px' }
                                                    : {
                                                        borderCollapse: 'collapse',
                                                        width: '100%',
                                                        marginTop: '20px',
                                                      }
                                                }
                                              >
                                                <TableHead>
                                                  <TableRow id={isDoc ? '' : 'un_table_header_row'}>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        textAlign: 'right',
                                                        borderLeft: isDoc
                                                          ? ''
                                                          : docStyle.borderLeft,
                                                        fontFamily: isDoc
                                                          ? ''
                                                          : docStyle.fontFamily,
                                                        fontSize: isDoc ? '' : docStyle.fontSize,
                                                        fontWeight: isDoc ? '' : '600',
                                                        height: isDoc
                                                          ? ''
                                                          : docStyle.tableHeaderHeight,
                                                      }}
                                                    >
                                                      מספר קומה‎
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        textAlign: 'right',
                                                        borderLeft: isDoc
                                                          ? ''
                                                          : docStyle.borderLeft,
                                                        fontFamily: isDoc
                                                          ? ''
                                                          : docStyle.fontFamily,
                                                        fontSize: isDoc ? '' : docStyle.fontSize,
                                                        fontWeight: isDoc ? '' : '600',
                                                        height: isDoc
                                                          ? ''
                                                          : docStyle.tableHeaderHeight,
                                                      }}
                                                    >
                                                      לחץ מדוד (Pa)
                                                    </StyledTableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {i.check_list.tests_per_floor.closed_doors_test.data.map(
                                                    (row) => (
                                                      <StyledTableRow key={row._id}>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            textAlign: 'right',
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {row.values[0]}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            textAlign: 'right',
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {row.values[1]}
                                                        </StyledTableCell>
                                                      </StyledTableRow>
                                                    ),
                                                  )}
                                                </TableBody>
                                              </Table>
                                            </TableContainer>
                                          </div>
                                        </div>
                                      )}
                                    {i.check_list &&
                                      i.check_list.tests_per_floor &&
                                      i.check_list.tests_per_floor.open_doors_test && (
                                        <div className="three_layer_three_doors_wrap report_node">
                                          <div className="three_layer_open_doors">
                                            <h1
                                              className={
                                                isDoc ? classes.headerText : 'HeaderText-Head'
                                              }
                                              style={{ color: 'black' }}
                                            >
                                              בדיקת לחצים בדלתות פתוחות‎
                                            </h1>
                                            {isDoc ? null : <br />}
                                            <TableContainer
                                              component={Paper}
                                              style={{ marginTop: isDoc ? '20px' : '' }}
                                            >
                                              <Table
                                                className={classesMUI.table}
                                                aria-label="customized table"
                                                style={
                                                  isDoc
                                                    ? {}
                                                    : { borderCollapse: 'collapse', width: '100%' }
                                                }
                                              >
                                                <TableHead>
                                                  <TableRow
                                                    id={isDoc ? '' : 'un_table_header_row2'}
                                                  >
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: isDoc
                                                          ? ''
                                                          : docStyle.borderLeft,
                                                        fontFamily: isDoc
                                                          ? ''
                                                          : docStyle.fontFamily,
                                                        fontSize: isDoc ? '' : docStyle.fontSize,
                                                        fontWeight: isDoc ? '' : '600',
                                                        height: isDoc
                                                          ? ''
                                                          : docStyle.tableHeaderHeight,
                                                      }}
                                                    >
                                                      מספר קומה‎
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: isDoc
                                                          ? ''
                                                          : docStyle.borderLeft,
                                                        fontFamily: isDoc
                                                          ? ''
                                                          : docStyle.fontFamily,
                                                        fontSize: isDoc ? '' : docStyle.fontSize,
                                                        fontWeight: isDoc ? '' : '600',
                                                        height: isDoc
                                                          ? ''
                                                          : docStyle.tableHeaderHeight,
                                                      }}
                                                    >
                                                      לחץ מדוד (Pa)
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: isDoc
                                                          ? ''
                                                          : docStyle.borderLeft,
                                                        fontFamily: isDoc
                                                          ? ''
                                                          : docStyle.fontFamily,
                                                        fontSize: isDoc ? '' : docStyle.fontSize,
                                                        fontWeight: isDoc ? '' : '600',
                                                        height: isDoc
                                                          ? ''
                                                          : docStyle.tableHeaderHeight,
                                                      }}
                                                    >
                                                      מהירות זרימת אויר (M/sec)‎
                                                    </StyledTableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {i.check_list.tests_per_floor.open_doors_test.data.map(
                                                    (row) => (
                                                      <StyledTableRow key={row._id}>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {row.values[0]}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {row.values[1]}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {row.values[2]}
                                                        </StyledTableCell>
                                                      </StyledTableRow>
                                                    ),
                                                  )}
                                                </TableBody>
                                              </Table>
                                            </TableContainer>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                  {i.child_systems &&
                                    i.child_systems.map((child_system) => {
                                      let system_type_column_height =
                                        child_system.system_type.length * 10 + 'px';
                                      let location_column_height =
                                        child_system.system_type.length * 10 + 'px';
                                      let findings_column_height =
                                        child_system.system_type.length * 10 + 'px';
                                      let cause_column_height =
                                        child_system.system_type.length * 10 + 'px';
                                      let repaired_type_column_height =
                                        child_system.system_type.length * 10 + 'px';
                                      return (
                                        <div
                                          className="four_layer report_node"
                                          id="table_test"
                                          style={!isDoc ? { marginTop: '30px' } : {}}
                                        >
                                          {!isDoc ? (
                                            <>
                                              {table_gap.map((item) => {
                                                if (idx === 2 || idx === 6) {
                                                  return (
                                                    <>
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                    </>
                                                  );
                                                } else if (idx === 8) {
                                                  return (
                                                    <>
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                      <br />
                                                    </>
                                                  );
                                                } else if (idx === 10 && ++page_count > 1) {
                                                  return (
                                                    <>
                                                      <br />
                                                    </>
                                                  );
                                                } else {
                                                  return null;
                                                }
                                              })}
                                            </>
                                          ) : null}
                                          <h1
                                            className={
                                              isDoc ? classes.headerText : 'HeaderText-Head'
                                            }
                                            style={{ color: 'black' }}
                                          >
                                            {child_system.system_type}
                                          </h1>
                                          {isDoc ? null : <br />}
                                          <TableContainer
                                            component={Paper}
                                            style={{ marginTop: isDoc ? '20px' : '' }}
                                          >
                                            <Table
                                              className={classesMUI.table}
                                              aria-label="customized table"
                                              style={
                                                isDoc
                                                  ? {}
                                                  : { borderCollapse: 'collapse', width: '100%' }
                                              }
                                            >
                                              {isDoc ? (
                                                <TableHead>
                                                  <TableRow id={isDoc ? '' : 'four_table_head_row'}>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        maxWidth: '30px',
                                                        height: system_type_column_height,
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                      }}
                                                    >
                                                      <span
                                                        id="text_vertical_last"
                                                        style={{
                                                          display: 'block',
                                                          whiteSpace: 'nowrap',
                                                          /* writingMode: 'vertical-rl',
                                                                    textOrientation: 'mixed'*/ transform:
                                                            'rotate(90deg)',
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        {child_system.system_type}
                                                      </span>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        maxWidth: '30px',
                                                        height: location_column_height,
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          display: 'block',
                                                          whiteSpace: 'nowrap',
                                                          /*writingMode: 'vertical-rl',
                                                                    textOrientation: 'mixed'*/ transform:
                                                            'rotate(90deg)',
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        מיקום
                                                      </span>
                                                    </StyledTableCell>

                                                    {child_system?.body?.[0]?.check_list?.data?.map?.(
                                                      (system_test, ind) => {
                                                        let column_height =
                                                          system_test.row_title.length * 10 + 'px';
                                                        dynamic_height =
                                                          system_test.row_title.length * 10 >
                                                          dynamic_height
                                                            ? system_test.row_title.length * 10
                                                            : dynamic_height;
                                                        if (
                                                          child_system?.body?.[0]?.check_list?.data
                                                            ?.length -
                                                            1 ===
                                                            ind &&
                                                          docsFire
                                                        ) {
                                                          dynamic_id.push({
                                                            className: `vertical_text_${++count_id}`,
                                                            height: `${dynamic_height}px`,
                                                          });
                                                          dynamic_height = 0;
                                                        }
                                                        return (
                                                          <StyledTableCell
                                                            key={system_test._id}
                                                            align="right"
                                                            className="rotate"
                                                            style={{
                                                              maxWidth: '30px',
                                                              height: column_height,
                                                              verticalAlign: 'bottom',
                                                              padding: '10px 5px',
                                                              borderRadius: '0',
                                                              borderTopLeftRadius: '0',
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                display: 'block',
                                                                whiteSpace: 'nowrap',
                                                                /*writingMode: 'tb',
                                                                                                                textOrientation: 'mixed',*/
                                                                transform: 'rotate(90deg)',
                                                                padding: '10px',
                                                                maxWidth: '30px',
                                                              }}
                                                            >
                                                              {system_test.row_title}
                                                            </span>
                                                          </StyledTableCell>
                                                        );
                                                      },
                                                    )}
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        height: findings_column_height,
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          display: 'block',
                                                          whiteSpace: 'nowrap',
                                                          /*writingMode: 'vertical-rl',
                                                                                        textOrientation: 'mixed'*/ transform:
                                                            'rotate(90deg)',
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        ממצאים
                                                      </span>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        height: cause_column_height,
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          display: 'block',
                                                          whiteSpace: 'nowrap',
                                                          /*writingMode: 'vertical-rl',
                                                                                        textOrientation: 'mixed'*/ transform:
                                                            'rotate(90deg)',
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        פעולה נדרשת
                                                      </span>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        height: repaired_type_column_height,
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          display: 'block',
                                                          whiteSpace: 'nowrap',
                                                          /*writingMode: 'vertical-rl',
                                                                                        textOrientation: 'mixed'*/ transform:
                                                            'rotate(90deg)',
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        תוקן במקום
                                                      </span>
                                                    </StyledTableCell>
                                                  </TableRow>
                                                </TableHead>
                                              ) : (
                                                <TableBody>
                                                  <TableRow id={isDoc ? '' : 'four_table_head_row'}>
                                                    <StyledTableCell
                                                      id={'vertical_text_dy'}
                                                      align="right"
                                                      style={{
                                                        maxWidth: '20px',
                                                        width: '20px',
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: docStyle.borderLeft,
                                                        fontFamily: docStyle.fontFamily,
                                                        fontSize: docStyle.fontSize,
                                                        fontWeight: '600',
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: '10px',
                                                          maxWidth: '20px',
                                                        }}
                                                      >
                                                        {child_system.system_type}
                                                      </div>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      id={'vertical_text_dy'}
                                                      align="left"
                                                      style={{
                                                        maxWidth: '20px',
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: docStyle.borderLeft,
                                                        fontFamily: docStyle.fontFamily,
                                                        fontSize: docStyle.fontSize,
                                                        fontWeight: '600',
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: '10px',
                                                          maxWidth: '20px',
                                                        }}
                                                      >
                                                        מיקום
                                                      </div>
                                                    </StyledTableCell>

                                                    {child_system?.body?.[0]?.check_list?.data?.map?.(
                                                      (system_test, ind) => {
                                                        let column_height =
                                                          system_test.row_title.length * 10 + 'px';
                                                        let isLast = false;
                                                        if (
                                                          child_system?.body?.[0]?.check_list?.data
                                                            ?.length -
                                                            1 ===
                                                            ind &&
                                                          docsFire
                                                        ) {
                                                          isLast = true;
                                                        }
                                                        return (
                                                          <StyledTableCell
                                                            id={
                                                              isLast
                                                                ? `vertical_text_dy`
                                                                : 'vertical_text_dy'
                                                            }
                                                            key={system_test._id}
                                                            align="left"
                                                            style={{
                                                              maxWidth: '30px',
                                                              verticalAlign: 'bottom',
                                                              padding: '10px 5px',
                                                              borderRadius: '0',
                                                              borderTopLeftRadius: '0',
                                                              borderLeft: docStyle.borderLeft,
                                                              fontFamily: docStyle.fontFamily,
                                                              fontSize: docStyle.fontSize,
                                                              fontWeight: '600',
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                padding: '10px',
                                                                maxWidth: '30px',
                                                              }}
                                                            >
                                                              {system_test.row_title}
                                                            </div>
                                                          </StyledTableCell>
                                                        );
                                                      },
                                                    )}
                                                    <StyledTableCell
                                                      id={'vertical_text_dy'}
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: docStyle.borderLeft,
                                                        fontFamily: docStyle.fontFamily,
                                                        fontSize: docStyle.fontSize,
                                                        fontWeight: '600',
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        ממצאים
                                                      </div>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      id={'vertical_text_dy'}
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: docStyle.borderLeft,
                                                        fontFamily: docStyle.fontFamily,
                                                        fontSize: docStyle.fontSize,
                                                        fontWeight: '600',
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        פעולה נדרשת
                                                      </div>
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                      id={'vertical_text_dy'}
                                                      align="right"
                                                      style={{
                                                        maxWidth: '50px',
                                                        verticalAlign: 'bottom',
                                                        borderRadius: '0',
                                                        borderTopLeftRadius: '0',
                                                        borderLeft: docStyle.borderLeft,
                                                        fontFamily: docStyle.fontFamily,
                                                        fontSize: docStyle.fontSize,
                                                        fontWeight: '600',
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: '10px',
                                                          maxWidth: '30px',
                                                        }}
                                                      >
                                                        תוקן במקום
                                                      </div>
                                                    </StyledTableCell>
                                                  </TableRow>
                                                </TableBody>
                                              )}
                                              <TableBody>
                                                {child_system.body &&
                                                  child_system.body.map((individual_system) => {
                                                    findings = '';
                                                    action_required = '';
                                                    repaired_on_spot = '';
                                                    if_any_test_done = '';
                                                    if_all_proper = 'yes';
                                                    return (
                                                      <TableRow key={individual_system._id}>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            whiteSpace: 'nowrap',
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {individual_system.actual_system_name}
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        >
                                                          {individual_system.location_floor}
                                                        </StyledTableCell>
                                                        {individual_system?.check_list?.data?.map?.(
                                                          (individual_system_test) => {
                                                            is_test_done = '';

                                                            action_required +=
                                                              '<p>' +
                                                              individual_system_test.values[2]
                                                                .value +
                                                              '</p>';

                                                            if (
                                                              typeof individual_system_test
                                                                .values[3].value === 'boolean' &&
                                                              individual_system_test.values[3]
                                                                .value === true
                                                            ) {
                                                              repaired_on_spot +=
                                                                '<p>תוקן במקום</p>';
                                                            } else {
                                                              repaired_on_spot += '<p></p>';
                                                            }
                                                            if (
                                                              typeof individual_system_test
                                                                .values[0].value === 'object' &&
                                                              individual_system_test.values[0]
                                                                .value != null &&
                                                              individual_system_test.values[0].value
                                                                .length === 0
                                                            ) {
                                                              if_any_test_done =
                                                                individual_system_test.values[0]
                                                                  .value;
                                                            }
                                                            if (
                                                              typeof individual_system_test
                                                                .values[0].value === 'object' &&
                                                              individual_system_test.values[0]
                                                                .value != null &&
                                                              individual_system_test.values[0].value
                                                                .length === 0
                                                            ) {
                                                              is_test_done = '';
                                                              is_test_done_color = '';
                                                              if_all_proper = 'no';
                                                            } else if (
                                                              individual_system_test.values[0]
                                                                .value === 'תקין'
                                                            ) {
                                                              is_test_done = 'V';
                                                              is_test_done_color = '';
                                                            } else {
                                                              is_test_done = 'X';
                                                              is_test_done_color = 'red';
                                                              if_all_proper = 'no';
                                                            }
                                                            /*if(findings === '' && if_any_test_done !== ''){
                                                                                                                findings += '<p>תקין</p>';
                                                                                                            } else {
                                                                                                                findings += '<p>'+individual_system_test.values[1].value+'</p>';
                                                                                                            }*/

                                                            if (
                                                              typeof individual_system_test
                                                                .values[1].value === 'object' &&
                                                              individual_system_test.values[1].value
                                                                .length === 0
                                                            ) {
                                                              findings += '<p></p>';
                                                            } else {
                                                              findings +=
                                                                '<p>' +
                                                                individual_system_test.values[1]
                                                                  .value +
                                                                ' , </p>';
                                                            }

                                                            //(individual_system_test.values[0].value=='תקין') ? individual_system_test.values[0].value : individual_system_test.values[1].value
                                                            return (
                                                              <StyledTableCell
                                                                key={individual_system_test._id}
                                                                align="right"
                                                                style={{
                                                                  padding: '10px 5px',
                                                                  color: is_test_done_color,
                                                                  border: isDoc
                                                                    ? ''
                                                                    : docStyle.border,
                                                                  fontFamily: isDoc
                                                                    ? ''
                                                                    : docStyle.fontFamily,
                                                                  fontSize: isDoc
                                                                    ? ''
                                                                    : docStyle.fontSize,
                                                                  fontWeight: isDoc ? '' : '100',
                                                                  padding: isDoc ? '' : '5px',
                                                                }}
                                                              >
                                                                {is_test_done}
                                                              </StyledTableCell>
                                                            );
                                                          },
                                                        )}

                                                        <StyledTableCell
                                                          align="right"
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              if_all_proper === 'yes'
                                                                ? '<p>תקין</p>'
                                                                : findings,
                                                          }}
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        ></StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          dangerouslySetInnerHTML={{
                                                            __html: action_required,
                                                          }}
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        ></StyledTableCell>
                                                        <StyledTableCell
                                                          align="right"
                                                          dangerouslySetInnerHTML={{
                                                            __html: repaired_on_spot,
                                                          }}
                                                          style={{
                                                            border: isDoc ? '' : docStyle.border,
                                                            fontFamily: isDoc
                                                              ? ''
                                                              : docStyle.fontFamily,
                                                            fontSize: isDoc
                                                              ? ''
                                                              : docStyle.fontSize,
                                                            fontWeight: isDoc ? '' : '100',
                                                            padding: isDoc ? '' : '5px',
                                                          }}
                                                        ></StyledTableCell>
                                                      </TableRow>
                                                    );
                                                  })}
                                              </TableBody>
                                            </Table>
                                          </TableContainer>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ReportsOrders;
