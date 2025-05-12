import {
  LIGHT_BLUE,
  BLUE_COLOR,
  RED,
  GREEN,
  TEXT_COLOR,
  DIALOG_BACKGROUND_COLOR,
} from '../../../constants/review-popup';
import { CHECK_LIST_TRANSLATION } from '../../../constants/translations/customersPage';
const EXPAND_ICON_COLOR = 'rgba(0, 0, 0, 0.54)';
const { PROPER, IMPROPER } = CHECK_LIST_TRANSLATION;

export class SystemStatusService {
  constructor() {}
  static getChildSystems = (systems, parentSystemId) => {
    const children = systems.find((i) => i.parent_system_id === parentSystemId);
    if (children) return children.systems;
    return [];
  };

  static getAllChildren = (systemLayers, parentSystem, layer) => {
    const { _id } = parentSystem;
    let allSystems = [parentSystem];
    let parentSystems = [parentSystem];
    const systemLayersSize = systemLayers.length;
    for (let currentLayer = layer + 1; currentLayer <= systemLayersSize; currentLayer++) {
      const layerSystems = systemLayers.find((systemLayer) => systemLayer.layer === currentLayer)
        .systems;
      let parentSystemsForNextIteration = [];
      for (let parentSystem of parentSystems) {
        const { _id } = parentSystem;
        const children = this.getChildSystems(layerSystems, _id);
        allSystems = [...allSystems, ...children];
        parentSystemsForNextIteration = [...parentSystemsForNextIteration, ...children];
      }
      parentSystems = [...parentSystemsForNextIteration];
    }

    return allSystems;
  };

  static calculateCompletedPercentage = (systems) => {
    const systemsWithCheckLists = systems.filter((i) => i.check_list);
    const systemsWithDoneCheckLists = systemsWithCheckLists.filter((i) => i.check_list.is_checked);
    const systemsTotal = systemsWithCheckLists.length;
    const checkedSystemsTotal = systemsWithDoneCheckLists.length;
    const completedStatus =
      !checkedSystemsTotal && !systemsTotal ? 0 : checkedSystemsTotal / systemsTotal;
    return completedStatus.toFixed(2);
  };

  static createGradient = (percentage, systemsActive) => {
    const darkGradientColor = systemsActive ? BLUE_COLOR : TEXT_COLOR;
    const lightGradientColor = systemsActive ? LIGHT_BLUE : DIALOG_BACKGROUND_COLOR;
    const donePercentage = parseFloat(percentage) * 100;
    const undoneGradient = `linear-gradient(to left, ${lightGradientColor} 0%, ${lightGradientColor} 100%)`;
    const doneGradient = `linear-gradient(to left, ${darkGradientColor} 0%, ${darkGradientColor} ${donePercentage}%, ${lightGradientColor} ${donePercentage}%, ${lightGradientColor} 100%)`;
    const gradient = donePercentage ? doneGradient : undoneGradient;
    return gradient;
  };

  static createStatusGradient = (systems = [], selectedSystem, layer, systemsActive) => {
    if (systems.length === 0) return;
    const lastLayerNumber = systems.sort((a, b) =>
      a.layer > b.layer ? -1 : a.layer < b.layer ? 1 : 0,
    )[0].layer;
    const lastLayer = layer === lastLayerNumber;
    let completedStatus = null;
    if (!lastLayer) {
      const systemsChain = this.getAllChildren(systems, selectedSystem, layer);
      completedStatus = this.calculateCompletedPercentage(systemsChain);
    } else if (lastLayer) {
      completedStatus = this.calculatePercentageForLastLayer(selectedSystem?.check_list);
    }

    const statusGradient = this.createGradient(completedStatus, systemsActive);
    return statusGradient;
  };

  static calculatePercentageForLastLayer = (checkList) => {
    if (checkList) {
      const doneTests = checkList?.data?.filter?.((test) => test.values?.[0]?.value)?.length;
      const allTests = checkList?.data?.length;
      const completedPercentage = (doneTests / allTests).toFixed(2);
      return completedPercentage;
    }
    return 0;
  };

  static setProperOrNot = (checkList, systemsActive) => {
    if (!systemsActive) return TEXT_COLOR;
    if (checkList) {
      // const doneTests = checkList?.data?.filter?.(test => test.values?.[0]?.value)?.length
      const allTests = checkList?.data?.length;
      // const notAllTestsDone = doneTests !== allTests
      // if(notAllTestsDone) return EXPAND_ICON_COLOR
      const properTests = checkList?.data?.filter?.((test) => test.values?.[0]?.value === PROPER)
        ?.length;
      const allTestsProper = properTests === allTests;
      if (allTestsProper) return GREEN;
      const isInValid = checkList?.data.map((item) => item.values?.[0]?.value).includes(IMPROPER);
      if (isInValid) return RED;
      else return EXPAND_ICON_COLOR;
    }
  };

  static setIconTransparent = (systemsActive) => {
    const style = systemsActive ? {} : { opacity: 0 };
    return style;
  };
}
