import { publicIpv4 } from 'public-ip';

export class checkIPService {
  publicIP: string = '';
  isBypass: boolean = false;

  async getPublicIP() {
    await publicIpv4().then((ip: string) => {
      this.publicIP = ip;
    });
  }

  public async checkIP(ipList: string[]) {
    await this.getPublicIP();
    let splitIP: string[] = this.publicIP.split('.');
    let counter: number = 0;
    while (!this.isBypass && ipList.length > counter) {
      let ipSplit: string[] = ipList[counter].split('.');
      let next: boolean = true;
      for (var i = 0; i < ipSplit.length; i++) {
        if (next) {
          if (ipSplit[i] == splitIP[i] || ipSplit[i] == '*') {
            this.isBypass = true;
          } else {
            next = false;
            this.isBypass = false;
          }
        }
      }
      if (next && this.isBypass && i == 4) {
        break;
      }
      counter++;
    }
    return this.isBypass;
  }
}
