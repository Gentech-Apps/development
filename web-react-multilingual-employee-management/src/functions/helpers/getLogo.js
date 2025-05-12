import srcLogoMetalpress from '../../images/logo/metalpress.png';
import srcLogoAlumzohar from '../../images/logo/alumzohar.png';
import srcLogoCochav from '../../images/logo/cochav.png';
import srcLogo from '../../images/logo/logo.svg';
import srcLogoMetalpressdoors from '../../images/logo/metalpressdoors_logo.png';
import { API } from '../../tools/keys/keys';
import * as factories from '../../constants/factories';

//TO DO hot fix
export function getLogo(user) {
  const { METALPRESS, ALUM_ZOHAR, COCHAV, METALPRESS_DOORS, DEMO } = factories;
  let { factory_id, factory_logo: logo } = user;

  if (logo) {
    logo = `${API}${logo}`;
    return logo;
  }

  switch (factory_id) {
    case COCHAV:
      logo = srcLogoCochav;
      break;
    case ALUM_ZOHAR:
      logo = srcLogoAlumzohar;
      break;
    case METALPRESS:
      logo = srcLogoMetalpress;
      break;
    case DEMO:
      logo = srcLogo;
      break;
    case METALPRESS_DOORS:
      logo = srcLogoMetalpressdoors;
      break;
    default:
      break;
  }

  return logo;
}
