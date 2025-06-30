export class ImportUser {
  index: number = 0;
  firstName: string | undefined = '';
  lastName: string | undefined = '';
  email: string | undefined = '';
  mobileNumber: string | undefined = '';
  areaOfInterest: string | undefined = '';
  examDate: string | undefined = '';
  examTime: string | undefined = '';
  status!: string;
  password!: string;
}
