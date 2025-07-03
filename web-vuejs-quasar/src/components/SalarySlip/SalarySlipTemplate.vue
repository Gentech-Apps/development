<template>
  <div>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
      integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <div style="position: relative">
      <div id="background">
        <div id="bg-water">
          <p id="bg-text">Confidentials</p>
        </div>
      </div>

      <div style="width: 180px; margin: auto; margin-top: 30px">
        <img
          style="width: 180px"
          src="../../assets/images/genesis-logo.png"
          alt="logo"
        />
      </div>

      <section class="salarySlipSection">
        <div class="container">
          <div class="col-md-12">
            <div class="col-md-6">
              <p class="company-title font-weight-bold">
                Genesis Information Technologies Services Pvt. Ltd
              </p>
              <p class="company-address">
                EB-103, Scheme no.94, Indore - 452016
              </p>
            </div>
            <div class="col-md-6"></div>
          </div>
          <div class="slipMonthText">
            <p>
              PAY SLIP FOR THE MONTH OF
              <span class="font-weight-bold">Jan 2023</span>
            </p>
          </div>
          <div>
            <table class="table">
              <tr>
                <th>Name</th>
                <td>Raviraj</td>
                <th>Employee Code</th>
                <td>01245</td>
              </tr>
              <!-----2 row--->
              <tr>
                <th>Designation</th>
                <td>x0x0x0</td>
                <th>Department.</th>
                <td>0x2x6x25x6</td>
              </tr>
              <!------3 row---->
              <tr>
                <th>Date of Joining</th>
                <td>23/02/xxxx</td>
                <th>PAN No.</th>
                <td>0</td>
              </tr>
              <!------4 row---->
              <tr>
                <th>UAN No.</th>
                <td>IT</td>
                <th>PRAN No.</th>
                <td>Designer</td>
              </tr>
              <!------5 row---->
              <tr>
                <th>Working Days</th>
                <td>India</td>
                <th>Paid Leaves</th>
                <td>30</td>
              </tr>
              <!------6 row---->
              <tr>
                <th>Present Days</th>
                <td>IT</td>
                <th>LWP</th>
                <td>Designer</td>
              </tr>
            </table>

            <table class="table">
              <tr>
                <th colspan="2">EARNINGS</th>
                <th colspan="2">DEDUCTIONS</th>
              </tr>
              <tr>
                <td>BASIC</td>
                <td>29000</td>
                <td>Provident Fund</td>
                <td>1900</td>
              </tr>
              <tr>
                <td>HRA</td>
                <td>2000</td>
                <td>Professional Tax</td>
                <td>600</td>
              </tr>
              <tr>
                <td>LTA</td>
                <td>400</td>
                <td>TDS</td>
                <td>500</td>
              </tr>
              <tr>
                <td>Special Allowance</td>
                <td>3000</td>
                <td>Loan/Advance</td>
                <td>3000</td>
              </tr>
              <tr>
                <td>Arrear</td>
                <td>2000</td>
                <td>Other Deductions</td>
                <td>2000</td>
              </tr>
              <tr>
                <td>Internet Re-imbursement</td>
                <td>1000</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Other Re-imbursement</td>
                <td>500</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Miss. Allowances</td>
                <td>600</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Leave Encashment</td>
                <td>600</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>Total Earnings</th>
                <td>Rs.38500</td>
                <th>Total Deductions</th>
                <td>Rs.3000</td>
              </tr>
              <tr>
                <th colspan="2">Net Pay (Rounded to nearest Rupee)</th>
                <th colspan="2">00000.00</th>
              </tr>
            </table>

            <table class="table">
              <tr>
                <th colspan="2">Other Contribution by Employer</th>
              </tr>
              <tr>
                <td class="font-weight-bold">PF</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td class="font-weight-bold">NPS</td>
                <td>0.00</td>
              </tr>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {},
};
</script>

<style>
@media print {
  @page {
    margin: 0;
  }
}
.salarySlipSection {
  margin-top: 5%;
}

.salarySlipSection .slipMonthText {
  margin: 25px 0px 25px 25px;
  font-size: 17px;
}

.salarySlipSection .table {
  table-layout: fixed;
  margin-bottom: 30px;
}

.salarySlipSection .table tr th {
  text-align: center;
}

.salarySlipSection .table:first-child tr th {
  text-align: unset;
  font-weight: 500;
}

.table tr td,
.table tr th {
  border: 1px solid #000;
  font-family: "";
}

.salarySlipSection .table tr th,
.salarySlipSection .table tr td {
  font-size: 15px;
}

.salarySlipSection p {
  margin-bottom: unset;
  font-family: "";
}

.salarySlipSection .company-title {
  font-weight: 500;
  text-decoration: underline;
  font-size: 17px;
  text-align: center;
}

.salarySlipSection .company-address {
  font-size: 17px;
  text-align: center;
}

.salarySlipSection .table:last-child {
  width: 50%;
}

.salarySlipSection .table:nth-child(2) tr:nth-last-child(2) th {
  text-align: unset;
}

.salarySlipSection .table:nth-child(2) tr:last-child {
  color: red;
}
#bg-water {
  transform: scale(3);
}
#bg-text {
  color: lightgrey;
  font-size: 50px;
  transform: rotate(317deg);
  opacity: 0.4;
}
#background {
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  top: 50%;
  z-index: 0;
}
</style>
