import React, { useState, useEffect, useRef } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { useStyles } from './styles';
import XLSX from 'xlsx';

const DownloadCsvReportCell = ({ loader, fileName, data, orderId, setIdForReport }) => {
  const [report, setReport] = useState('');
  const [isClicked, setClicked] = useState(false);

  useEffect(() => {
    if (data?.length) {
      setReport(data);
    }
  }, [data]);

  const getDataClickHandler = () => {
    setClicked(true);
    setIdForReport(orderId);
  };

  useEffect(() => {
    if (report?.length && isClicked) {
      downloadxls(report);
      setClicked(false);
    }
  }, [report, isClicked]);

  const downloadxls = async (data) => {
    const autofitColumns = (json, worksheet) => {
      let objectMaxLength = [];

      json.map((jsonData) => {
        Object.entries(jsonData).map(([, v], idx) => {
          let columnValue = v;
          objectMaxLength[idx] =
            objectMaxLength?.[idx] >= columnValue?.length
              ? objectMaxLength?.[idx]
              : columnValue?.length;
        });
      });
      const wscols = objectMaxLength.map((w) => ({ width: w }));
      const editedWsCols = wscols.map((i) => (i.width < 5 ? { width: 5 } : i));
      worksheet['!cols'] = editedWsCols;

      // calculate row height
      // const LINE_HEIGHT = 15
      // const rowsHeight = json.map(row => {
      //   if(row){
      //     const showStopperLines = row?.[row.length - 1]?.split(',')?.length
      //     const height = showStopperLines ? (showStopperLines * LINE_HEIGHT) : LINE_HEIGHT
      //     return ({hpt: height})
      //   }
      //   return ({hpt: LINE_HEIGHT})

      // })

      // worksheet["!rows"] = rowsHeight
    };

    const ws = XLSX.utils.json_to_sheet(data, {
      skipHeader: true,
    });
    const wb = XLSX.utils.book_new();
    wb.Workbook = {
      Views: [{ RTL: true }],
    };

    const wscols = autofitColumns(data, ws);

    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const classes = useStyles();
  return (
    <DescriptionOutlinedIcon className={`${classes.colorForIcons}`} onClick={getDataClickHandler} />
  );
};

export default DownloadCsvReportCell;
