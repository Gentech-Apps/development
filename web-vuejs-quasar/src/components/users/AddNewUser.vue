<template>
  <div>
    <div>
      <div class="q-ml-lg q-gutter-sm" style="position: relative">
        <q-btn
          flat
          label="Add New User"
          color="primary"
          @click="confirmDialogOpen"
          data-id="users-addnewuser"
        />

        <q-dialog
          v-model="layout"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./users">
              <q-card style="width: 800px">
                <q-card-section class="q-pb-none">
                  <div>
                    <div
                      class="text-h6 text-center q-px-sm q-pb-md"
                      data-id="newuserregistration"
                    >
                      Add New User
                    </div>

                    <div
                      style="
                        margin-top: -50px;
                        display: flex;
                        justify-content: flex-end;
                      "
                    >
                      <q-toggle
                        v-model="payrollOnly"
                        :class="payrollOnly ? 'text-green' : 'text-red'"
                        @click="usePayrollOnly"
                        data-id="newuserregistration-switchtopayrollonly"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          class="bg-tip shadow-1"
                          :offset="[10, 10]"
                        >
                          Switch To Payroll Only
                        </q-tooltip>
                      </q-toggle>
                    </div>
                  </div>
                </q-card-section>
                <div style="max-height: 75vh; overflow-y: auto">
                  <div class="q-pl-md">
                    <div class="row justify-center">
                      <div class="text-center">
                        <img
                          dense
                          :src="imageConverted"
                          style="
                            border-radius: 10000px;
                            height: 100px;
                            width: 100px;
                          "
                          class=""
                        />
                      </div>
                    </div>
                    <div class="row" style="justify-content: center">
                      <div style="max-width: 250px">
                        <q-file
                          max-files="1"
                          counter
                          color="grey-3"
                          accept=".jpg, image/*"
                          outlined
                          dense
                          max-file-size="2500000"
                          v-model="image"
                          label="Select Profile Picture"
                          class="q-pl-xs"
                          @rejected="onRejected"
                          @update:model-value="onFileChange"
                          data-id="newuserregistration-selectprofilepicture"
                        >
                          <template>
                            <q-icon name="attachment" />
                          </template>
                        </q-file>
                      </div>
                    </div>
                    <q-dialog v-model="showCropper">
                      <q-card>
                        <q-card-section>
                          <div>
                            <div class="image-cropper">
                              <img ref="imageCropper" class="full-width" />
                            </div>
                          </div>
                        </q-card-section>
                        <q-card-actions class="justify-end">
                          <q-btn
                            label="Submit"
                            color="primary"
                            flat
                            @click="cropImage"
                          />
                          <q-btn
                            label="Cancel"
                            color="negative"
                            flat
                            @click="closeCropper"
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="empId"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Employee Id',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="Employee Id"
                        data-id="newuserregistration-employeeid"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="firstName"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter first name',
                        ]"
                        label="First Name"
                        data-id="newuserregistration-firstname"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="lastName"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter last name',
                        ]"
                        label="Last Name"
                        data-id="newuserregistration-lastname"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-select
                        outlined
                        dense
                        v-model="gender"
                        :options="['Male', 'Female']"
                        label="Select Gender"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please select Gender.',
                        ]"
                        data-id="newuserregistration-selectgender"
                      >
                      </q-select>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="dateofbirth"
                        lazy-rules
                        label="Date of Birth"
                        dense
                        readonly
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter date of birth',
                        ]"
                        @click="$refs.qDateDob.show()"
                        data-id="newuserregistration-dateofbirth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateDob"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="dateofbirth"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-dateofbirth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="dateofbirthcalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="actualBirthDate"
                        lazy-rules
                        label="Actual Date of Birth"
                        dense
                        readonly
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter actual date of birth',
                        ]"
                        @click="$refs.qDateActualDob.show()"
                        data-id="newuserregistration-actualdateofbirth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateActualDob"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="actualBirthDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-actualdateofbirth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="actualdateofbirthcalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>

                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        ref="dateOfJoiningRef"
                        outlined
                        v-model="date"
                        lazy-rules
                        label="Date of Joining"
                        dense
                        readonly
                        :rules="[joiningDateValidation]"
                        @click="$refs.qDateJoining.show()"
                        data-id="newuserregistration-dateofjoining"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateJoining"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="date"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-dateofjoining-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="dateofjoiningcalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        ref="panNumberValidation"
                        outlined
                        dense
                        v-model="panNumber"
                        lazy-rules
                        label="PAN Number"
                        :rules="[
                          (val) =>
                            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) ||
                            (payrollOnly &&
                              (!val ||
                                /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val))) ||
                            'Please enter valid PAN Number',
                        ]"
                        data-id="newuserregistration-pannumber"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        ref="adharNumberValidation"
                        outlined
                        dense
                        v-model="adharNumber"
                        lazy-rules
                        mask="####-####-####"
                        label="Aadhar Number"
                        :rules="[
                          (val) =>
                            /^[2-9]{1}[0-9]{3}([- ][0-9]{4}){2}$/.test(val) ||
                            'Please Enter 12 digits valid Aadhar Number.',
                        ]"
                        data-id="newuserregistration-adharnumber"
                      />
                    </div>
                  </div>

                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        ref="biometricIdValidation"
                        outlined
                        dense
                        v-model="biometricId"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            payrollOnly ||
                            'Please enter Biometric Id',
                          (val) =>
                            /^[0-9]*$/.test(val) ||
                            (payrollOnly && (!val || /^[0-9]*$/.test(val))) ||
                            'Please Enter Numbers Only',
                        ]"
                        label="Biometric Id"
                        data-id="newuserregistration-biometricid"
                      />
                    </div>

                    <div
                      class="q-gutter-md col-4 q-pl-md capital"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="primaryDepartment"
                        :options="filteredPrimaryDepartments"
                        @update:model-value="clearFilter"
                        label="Primary Department"
                        option-label="label"
                        ref="designationValidation"
                        :rules="[primaryDepartmentValidations]"
                        data-id="newuserregistration-designation"
                      >
                      </q-select>
                    </div>

                    <div
                      class="q-gutter-md col-4 q-pl-md capital"
                      style="max-width: 300px"
                    >
                      <q-select
                        ref="dept"
                        outlined
                        multiple
                        dense
                        v-model="selectSecondaryDepartments"
                        use-input
                        input-debounce="0"
                        :options="filteredSecondryDepartments"
                        @filter="filterFnDepartments"
                        label="Secondary Departments"
                        emit-value
                        map-options
                        option-value="id"
                        option-label="label"
                        data-id="newuserregistration-selectdepartments"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <div
                      v-if="!payrollOnly"
                      class="q-gutter-md col-4"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="userGrade"
                        :options="gradeOptions"
                        label="Select Grade"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please select Grade.',
                        ]"
                        data-id="newuserregistration-selectgrade"
                      >
                      </q-select>
                    </div>
                  </div>

                  <div v-if="!payrollOnly" class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="skypeId"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter Skype Id',
                        ]"
                        label="Skype Id"
                        data-id="newuserregistration-skypeid"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-input
                        outlined
                        dense
                        type="email"
                        v-model="genesisEmail"
                        @update:model-value="genesisEmailChange"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter email',
                          (val) =>
                            /^\w+([\.-]?\w+)*@genesistechnologies\.in$/.test(
                              val,
                            ) || 'Please Enter valid Genesis Email',
                        ]"
                        label="Genesis Email"
                        data-id="newuserregistration-genesisemail"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-input
                        outlined
                        dense
                        type="email"
                        v-model="googleEmail"
                        @update:model-value="googleEmailChange"
                        label="Google Email"
                        data-id="newuserregistration-googleemail"
                      />
                    </div>
                  </div>

                  <div v-if="!payrollOnly" class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4">
                      <q-select
                        outlined
                        dense
                        v-model="selectedUserType"
                        :options="userTypes"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select user type',
                        ]"
                        label="Select User Type"
                        data-id="newuserregistration-selectusertype"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-select
                        outlined
                        dense
                        v-model="mentor"
                        use-input
                        input-debounce="0"
                        emit-value
                        map-options
                        :options="filteredUsers"
                        @filter="filterFnUsers"
                        label="Select Mentor"
                        option-value="id"
                        option-label="label"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please select a Mentor',
                        ]"
                        data-id="newuserregistration-selectmentor"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        :type="pass"
                        v-model="password"
                        lazy-rules
                        autocomplete="new-password"
                        :rules="[
                          (val) =>
                            (val && val.length >= 6) ||
                            'Please enter password of Minimum 6 Character',
                        ]"
                        label="Password"
                        data-id="newuserregistration-password"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="check ? 'visibility_off' : 'visibility'"
                            @click="change()"
                            class="cursor-pointer"
                          />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div v-if="!payrollOnly" class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        ref="currentGradeDateRef"
                        outlined
                        v-model="currentGradeDate"
                        lazy-rules
                        label="Current Grade Date"
                        dense
                        readonly
                        @click="$refs.qCurrentGradeDate.show()"
                        :rules="[currentGradeDateValidation]"
                        data-id="newuserregistration-currentgradedate"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qCurrentGradeDate"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="currentGradeDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-currentgradedate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="newuserregistration-currentgradedate-calendarok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="lastAppraisalDate"
                        lazy-rules
                        label="Last Appraisal Date"
                        dense
                        readonly
                        @click="$refs.qLastAppraisalDate.show()"
                        data-id="newuserregistration-lastappraisaldate"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qLastAppraisalDate"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="lastAppraisalDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-lastappraisaldate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="newuserregistration-lastappraisaldate-calendarok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        ref="nextAppraisalDateRef"
                        outlined
                        v-model="nextAppraisalDate"
                        lazy-rules
                        label="Next Appraisal Date"
                        dense
                        readonly
                        @click="$refs.qNextAppraisalDate.show()"
                        :rules="[nextAppraisalDateValidation]"
                        data-id="newuserregistration-nextappraisaldate"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qNextAppraisalDate"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="nextAppraisalDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="newuserregistration-nextappraisaldate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="newuserregistration-nextappraisaldate-calendarok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="bankName"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter Bank name',
                        ]"
                        label="Bank Name"
                        data-id="newuserregistration-bankname"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="ifsc"
                        :maxlength="11"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length === 11) ||
                            'Please enter IFSC code(11 Digit alpha-numeric )',
                        ]"
                        label="IFSC Code"
                        data-id="newuserregistration-ifsccode"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="account"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length >= 8 && val.length <= 17) ||
                            'Please enter Account Number(Between 8 to 17 digit)',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="Account Number"
                        data-id="newuserregistration-accountnumber"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4">
                      <q-input
                        ref="mobileNumberValidation"
                        outlined
                        dense
                        v-model="mobileNumber"
                        type="tel"
                        mask="##########"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length === 10) ||
                            (payrollOnly && (!val || val.length === 10)) ||
                            'Please enter valid Mobile Number',
                          (val) =>
                            /^[1-9]\d{9}$/.test(val) ||
                            (payrollOnly &&
                              (!val || /^[1-9]\d{9}$/.test(val))) ||
                            'Mobile Number can not start with 0.',
                        ]"
                        label="Mobile Number"
                        data-id="newuserregistration-mobilenumber"
                      />
                    </div>

                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="beneficiaryCode"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Beneficiary Code',
                          (val) =>
                            (val && val.length <= 20) ||
                            'Beneficiary Code should not be greater than 20 Char.',
                          (val) =>
                            /^[a-z0-9]*$/i.test(val) ||
                            'Please Enter Numbers and Characters Only',
                        ]"
                        label="Beneficiary  Code"
                        data-id="newuserregistration-beneficiarycode"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md capital"
                      style="max-width: 300px"
                      v-if="primaryDepartment != null"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="designation"
                        :options="designationOptions"
                        label="Designation"
                        option-label="label"
                        ref="designationValidation"
                        :rules="[
                          (val) =>
                            designationValidation(val) ||
                            'Please select a valid designation',
                        ]"
                        data-id="newuserregistration-designation"
                      >
                      </q-select>
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="gross"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length >= 1) ||
                            'Please enter Gross salary',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="Gross Salary"
                        data-id="newuserregistration-grosssalary"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-select
                        ref="salaryGradeValidation"
                        outlined
                        dense
                        v-model="salaryGrade"
                        :options="gradeOptions"
                        label="Select Salary Grade"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please select Grade.',
                        ]"
                        data-id="newuserregistration-selectsalarygrade"
                      >
                      </q-select>
                    </div>
                    <div
                      v-if="!payrollOnly"
                      class="q-gutter-md col-4"
                      style="max-width: 300px"
                    >
                      <!-- <div class="col-2 text">Copy Salary Grade</div> -->
                      <div class="col-2 text">
                        <q-checkbox
                          v-model="val"
                          data-id="newuserregistration-copyleavegrade"
                          size="sm"
                        />
                      </div>
                      <div class="col-2 checkbox">Copy Leave Grade</div>
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div
                      v-if="!payrollOnly"
                      class="q-gutter-md col-4"
                      style="max-width: 300px"
                    >
                      <q-checkbox
                        v-model="timesheetExemption"
                        label="Timesheet Exemption"
                        data-id="newuserregistration-timesheetexemption"
                        size="sm"
                      />
                    </div>
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-checkbox
                        :disable="salaryGrade === 'G1'"
                        v-model="valpf"
                        label="PF Opted by User"
                        data-id="newuserregistration-pfoptedbyuser"
                        size="sm"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row" v-if="valpf == true">
                    <div
                      v-if="valpf == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="uan"
                        mask="############"
                        lazy-rules
                        :rules="[
                          (val) =>
                            val.length == 0 ||
                            val.length == 12 ||
                            'Please enter UAN number(12 Digit)',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="UAN Number"
                        data-id="newuserregistration-uannumber"
                      />
                    </div>
                    <div
                      v-if="valpf == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="pfOptedDate"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select PF Opted Month.',
                          (val) =>
                            (val && checkPfOPted()) ||
                            'PF opted month should not be less than date of joining.',
                        ]"
                        label="PF Opted Month"
                        dense
                        readonly
                        @click="$refs.qPFDate.show()"
                        data-id="newuserregistration-pfoptedmonth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qNPSDate"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="pfOptedDate"
                                years-in-month-view
                                default-view="Months"
                                @update:model-value="onUpdateMv"
                                :key="dpKey"
                                emit-immediately
                                minimal
                                mask="MMM YY"
                                :navigation-min-year-month="minPfOptedMonth"
                                class="myDate"
                                data-id="newuserregistration-pfoptedmonth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="newuserregistration-pfoptedmonth-calendarok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-checkbox
                        :disable="salaryGrade == 'G1'"
                        v-model="valnps"
                        label="NPS Opted by User"
                        data-id="newuserregistration-npsoptedbyuser"
                        size="sm"
                      />
                    </div>
                  </div>
                  <div
                    class="q-pl-lg q-mt-md row"
                    id="scrollId"
                    v-if="valnps == true"
                  >
                    <div
                      v-if="valnps == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="npsOpt"
                        :options="['7.5%', '10%']"
                        label="NPS Percentage"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select NPS Percentage.',
                        ]"
                        data-id="newuserregistration-npspercentage"
                      >
                      </q-select>
                    </div>
                    <div
                      v-if="valnps == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="pran"
                        mask="############"
                        lazy-rules
                        :rules="[
                          (val) =>
                            val.length == 0 ||
                            val.length == 12 ||
                            'Please enter PRAN number(12 Digit)',
                          (val) =>
                            val.length == 0 ||
                            /^[1-9]{1}[0-9]*$/.test(val) ||
                            'PRAN number should not start with 0',
                        ]"
                        label="PRAN Number"
                        data-id="newuserregistration-prannumber"
                      />
                    </div>
                    <div
                      v-if="valnps == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="npsOptedDate"
                        lazy-rules
                        label="NPS Opted Month"
                        dense
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select Nps Opted Month.',
                          (val) =>
                            (val && checkNpsOpted()) ||
                            'Nps opted month should not be less than date of joining.',
                        ]"
                        readonly
                        @click="$refs.qNPSDate.show()"
                        data-id="newuserregistration-npsoptedmonth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qNPSDate"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="npsOptedDate"
                                years-in-month-view
                                default-view="Months"
                                @update:model-value="onUpdateMv"
                                :key="dpKey"
                                emit-immediately
                                minimal
                                mask="MMM YY"
                                :navigation-min-year-month="minNpsOptedMonth"
                                class="myDate"
                                data-id="newuserregistration-npsoptedmonth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="newuserregistration-npsoptedmonth-calendarok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row" v-if="!payrollOnly">
                    <div class="q-gutter-md col-4" style="max-width: 250px">
                      <q-file
                        max-files="1"
                        counter
                        color="grey-3"
                        accept=".jpg, image/*"
                        outlined
                        dense
                        max-file-size="2500000"
                        v-model="birthdayImage"
                        label="Select Birthday Image"
                        class="q-pl-xs"
                        @rejected="onRejected"
                        :rules="[checkBirthdayImage]"
                        data-id="newuserregistration-selectbirthdayimage"
                      >
                        <template>
                          <q-icon name="attachment" />
                        </template>
                      </q-file>
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <img
                        dense
                        :src="uploadedBirthdayImage"
                        style="
                          border-radius: 10000px;
                          height: 50px;
                          width: 50px;
                          margin-top: 12px;
                        "
                        class=""
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="negative"
                      flat
                      label="cancel"
                      @click="close"
                      data-id="newuserregistration-cancelbutton"
                    />
                    <q-btn
                      flat
                      type="submit"
                      color="primary"
                      label="Submit"
                      data-id="newuserregistration-submitbutton"
                    />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
          <q-dialog
            v-model="errorLayout"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="bg-negative text-white login-error">
              <q-card-section>
                <div class="text-h6">
                  <q-icon
                    name="warning"
                    class="text-white"
                    style="font-size: 2rem"
                  />
                  Invalid data
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ errMsg }}
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn
                  flat
                  color="negative"
                  label="OK"
                  @click="errorLayout = false"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-dialog>
      </div>
    </div>
    <ValidateKeyForm
      :tabName="'Users'"
      :modal="confirmDialog1"
      @onClose="closeDialog1"
      @oncloseNotFound="onCloseNotFound"
    />
    <imagePreview
      :layout="imagePreviewOpen"
      :data="imageData"
      @previewSubmit="previewSubmitModel"
      @close="closePreviewModel"
    />
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import ImagePreview from "../../components/Profile/ImagePreview";
import ValidateKeyForm from "../../components/ValidateKeyForm.vue";
import * as departmentsService from "../../services/departments.service";
import { fetchAllDesignation } from "../../services/designations.service";
import * as encryptDecrypt from "../../services/encryptionDecryptionService";
import * as functions from "../../services/functions";
import * as salaryPeriod from "../../services/masterSalary.service";
import * as usersService from "../../services/users.service";
import Notify from "../Notify.vue";
import { ref } from "vue";

export default {
  components: { Notify, ValidateKeyForm, ImagePreview },
  data() {
    return {
      showCropper: false,
      cropperInstance: null,
      formData: new FormData(),
      file: "",
      imagePreviewOpen: false,
      imageData: "",
      payrollOnly: false,
      timesheetExemption: false,
      designation: null,
      confirmDialog1: false,
      secretKey: "",
      minpfOptedMonth: "",
      minNpsOptedMonth: "",
      beneficiaryCode: null,
      pfOptedDate: "",
      npsOptedDate: "",
      gross: null,
      bankName: null,
      ifsc: null,
      account: null,
      npsOpt: ref("7.5%"),
      uan: "",
      pran: "",
      val: ref(true),
      valpf: ref(false),
      valnps: ref(false),
      salaryGrade: "",
      gradeDateErr: false,
      gradeDateErrorMassage: "",
      apprDateErr: false,
      apprGradeDateErrorMassage: "",
      pfOptedDateErrorMassage: "",
      pfOptedDateDateErr: "",
      npsOptedDateErr: false,
      npsOptedDateErrorMassage: "",
      pass: "password",
      layout: false,
      check: true,
      firstName: "",
      lastName: "",
      empId: "",
      errMsg: "",
      mobileNumber: "",
      panNumber: null,
      adharNumber: null,
      users: [],
      filteredUsers: [],
      mentor: "",
      genesisEmail: "",
      googleEmail: "",
      password: "",
      date: "",
      dateofbirth: "",
      actualBirthDate: "",
      gender: "",
      nextAppraisalDate: "",
      lastAppraisalDate: "",
      currentGradeDate: "",
      today: new Date(),
      selectedUserType: null,
      selectSecondaryDepartments: [],
      filteredPrimaryDepartments: [],
      errorLayout: false,
      departments: [],
      secondaryDepartments: [],
      gradeOptions: ["G1", "G2", "G3", "G4"],
      designationOptions: [],
      filterDesignationOptions: [],
      PFOptions: ["YES", "NO"],
      userGrade: null,
      arr: [],
      userTypes: ["User", "Mentor", "Manager", "Admin"],
      msg: [],
      biometricId: "",
      skypeId: "",
      googlemsg: [],
      image: [],
      birthdayImage: [],
      uploadedBirthdayImage:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      imageConverted:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      blob: "",
      birthdayBlob: [],
      successMsg: "",
      primaryDepartment: null,
      filteredSecondryDepartments: [],
    };
  },
  watch: {
    dateofbirth: function (newVal) {
      this.actualBirthDate = newVal;
    },
    valpf: function (newVal) {
      if (newVal == false) {
        this.pfOptedDate = "";
        this.uan = "";
      }
    },
    valnps: function (newVal) {
      setTimeout(() => {
        document.getElementById("scrollId").scrollIntoView();
      }, 100);

      if (newVal == false) {
        this.npsOptedDate = "";
        this.npsOpt = ref("7.5%");
        this.pran = "";
      }
    },
    salaryGrade: function (newVal) {
      if (this.valpf && newVal == "G1") {
        this.valpf = false;
      }
      if (this.valnps && newVal == "G1") {
        this.valnps = false;
      }
    },
    secretKey: function (newVal) {
      this.secretKeyEncrypt = newVal;
    },
    date: function (newVal) {
      this.$refs.dateOfJoiningRef.validate();
      if (this.date) {
        var datearray = this.date.split("/");
        var newdatemodified = datearray[2] + "/" + datearray[1];
        this.minNpsOptedMonth = newdatemodified;
        this.minPfOptedMonth = newdatemodified;
      }
    },
    userGrade: function (newVal) {
      if (this.val == true) {
        this.salaryGrade = this.userGrade;
      } else {
        this.salaryGrade = null;
      }
    },
    val: function (newVal) {
      if (newVal == true) {
        this.salaryGrade = this.userGrade;
      } else {
        this.salaryGrade = !this.payrollOnly ? null : this.salaryGrade;
      }
    },

    image: function (newVal) {
      if (newVal != "" && newVal != undefined) {
        this.onFileChange(newVal);
      }
    },

    birthdayImage: function (newVal) {
      if (newVal != "" && newVal != undefined) {
        this.changeEvent(newVal);
      }
    },

    currentGradeDate: function (val) {
      this.$refs.currentGradeDateRef.validate();
    },
    nextAppraisalDate: function (val) {
      this.$refs.nextAppraisalDateRef.validate();
    },
    payrollOnly: function (newVal) {
      if (newVal) {
        this.$refs.mobileNumberValidation.resetValidation();
        this.$refs.biometricIdValidation.resetValidation();
        this.$refs.panNumberValidation.resetValidation();
        this.$refs.adharNumberValidation.resetValidation();
        this.$refs.dept.resetValidation();
        this.$refs.salaryGradeValidation.resetValidation();
      }
    },
  },
  setup() {
    const dpKey = ref(Date.now());
    function onUpdateMv(v) {
      dpKey.value = Date.now();
    }
    return {
      dpKey,
      onUpdateMv,
    };
  },
  methods: {
    designationValidation(val) {
      const designationData = this.filterDesignationOptions.find(
        (d) => d._id == val?.id,
      );
      if (!(designationData?.departments == this.primaryDepartment?.id)) {
        return "Please select a valid department";
      }
      if (val && val.label?.length > 0) {
        return true;
      }
      return false;
    },
    primaryDepartmentValidations(val) {
      if (!val) return "Please select primary department";
      this.secondaryDepartments = this.departments?.filter(
        (d) => d.id != this.primaryDepartment?.id,
      );
      this.filteredSecondryDepartments = [...this.secondaryDepartments];
      this.selectSecondaryDepartments = this.selectSecondaryDepartments.filter(
        (d) => d != this.primaryDepartment?.id,
      );
      this.$refs.designationValidation.resetValidation();
      return true;
    },
    secondaryDepartmentsValidations(val) {
      if (val.includes(this.primaryDepartment?.id))
        "This department is your primary department";
      return true;
    },
    checkBirthdayImage() {
      if (this.file.length === 0) {
        return "Please Select Birthday Image";
      } else {
        return true;
      }
    },
    async storeBirthdayTemplates(userId) {
      this.$q.loading.show();
      this.formData.append("userId", userId);
      this.formData.append("isDefault", true);
      const res = await usersService.uploadImageByUser(this.formData);
      if (res.data.ok) {
        this.file = "";
      } else {
        this.errMsg = res.data.message;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
    async setBlobToFormData(i) {
      let uploadMefile = new File(
        [this.birthdayBlob[i].blobFile],
        this.birthdayBlob[i].fileName,
        {
          type: this.birthdayBlob[i].blobFile.type,
        },
      );
      this.formData.append("file", uploadMefile);
      this.$q.loading.hide();
      this.closePreviewModelOnUpload();
    },
    async previewSubmitModel(data) {
      this.birthdayBlob.push({
        index: data.index,
        fileName: data.fileName,
        blobFile: new Blob([data.blobFile], { type: "image/png" }),
        blobUrl: data.blobUrl,
        isApproved: false,
      });
      this.uploadedBirthdayImage = data.blobUrl;
      await this.setBlobToFormData(data.index);
    },
    closePreviewModelOnUpload() {
      this.imageData = {};
      this.imagePreviewOpen = false;
    },
    closePreviewModel() {
      (this.birthdayBlob = []),
        (this.file = ""),
        (this.birthdayImage = ""),
        (this.imageData = {});
      this.imagePreviewOpen = false;
      this.formData.delete("file");
      this.formData.delete("userId");
      this.formData.delete("isDefault");
      this.uploadedBirthdayImage = "";
    },
    eventCalling() {
      const data = {
        index: this.birthdayBlob.length,
        fileName: this.file.name,
        imageURL: URL.createObjectURL(this.file),
      };
      this.imageData = data;
      this.imagePreviewOpen = true;
    },
    changeEvent(event) {
      this.file = event;
      var stateChange = true;
      var height = 0;
      var width = 0;
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          stateChange = true;
          return true;
        };
      };

      setTimeout(() => {
        if (stateChange) {
          this.eventCalling();
        }
      }, 500);
    },
    joiningDateValidation() {
      if (!this.date) {
        return "Please enter date of joining";
      }

      if (
        this.nextAppraisalDate &&
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) <
          new Date(functions.convertDateToUTC(this.date)).setHours(
            0,
            0,
            0,
            0,
          ) &&
        this.currentGradeDate &&
        new Date(functions.convertDateToUTC(this.currentGradeDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        return "Date of Joining should not be greater than next appraisal date and current grade date.";
      } else if (
        this.nextAppraisalDate &&
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        return "Date of Joining should not be greater than next appraisal date.";
      } else {
        this.nextAppraisalDate &&
          this.$refs.nextAppraisalDateRef.resetValidation();
      }

      if (
        this.currentGradeDate &&
        new Date(functions.convertDateToUTC(this.currentGradeDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        return "Date of Joining should not be greater than Current Grade date.";
      } else {
        this.currentGradeDateRef &&
          this.$refs.currentGradeDateRef.resetValidation();
      }
      return true;
    },
    nextAppraisalDateValidation() {
      if (!this.nextAppraisalDate) return "Please enter next appraisal date.";

      if (
        this.date &&
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        return "Next Appraisal date should not be less than Date of Joining.";
      } else if (
        this.currentGradeDate &&
        new Date(functions.convertDateToUTC(this.currentGradeDate)).setHours(
          0,
          0,
          0,
          0,
        ) >=
          new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        this.$refs.dateOfJoiningRef.resetValidation();
      }

      if (
        this.nextAppraisalDate &&
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) <=
          new Date(functions.convertDateToUTC(this.lastAppraisalDate)).setHours(
            0,
            0,
            0,
            0,
          )
      ) {
        return "Next Appraisal Date should not be less than Last Appraisal Date.";
      }

      return true;
    },
    currentGradeDateValidation() {
      if (!this.currentGradeDate) {
        return "Please enter current grade date.";
      }

      if (
        this.currentGradeDate &&
        new Date(functions.convertDateToUTC(this.currentGradeDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        return "Current Grade date should not be less than Date of Joining.";
      } else if (
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) >=
        new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        this.$refs.dateOfJoiningRef.resetValidation();
      }
      return true;
    },
    usePayrollOnly() {
      this.val = false;
    },
    checkPfOPted() {
      let filteredDate = functions.getMonthStartAndEndDate(this.pfOptedDate);
      let payrollMonth = moment(filteredDate.MonthStart).format("YYYY/MM");
      let dateOfJOin = moment(
        new Date(functions.convertDateToUTC(this.date)),
      ).format("YYYY/MM");
      if (this.pfOptedDate && payrollMonth < dateOfJOin) {
        return false;
      } else if (this.pfOptedDate && payrollMonth >= dateOfJOin) {
        return true;
      }
    },

    checkNpsOpted() {
      let filteredDate = functions.getMonthStartAndEndDate(this.npsOptedDate);
      let payrollMonth = moment(filteredDate.MonthStart).format("YYYY/MM");
      let dateOfJOin = moment(
        new Date(functions.convertDateToUTC(this.date)),
      ).format("YYYY/MM");
      if (this.npsOptedDate && payrollMonth < dateOfJOin) {
        return false;
      } else if (this.npsOptedDate && payrollMonth >= dateOfJOin) {
        return true;
      }
    },
    confirmDialogOpen() {
      this.payrollOnly = false;
      this.confirmDialog1 = true;
    },
    closeDialog1(data) {
      this.secretKey = data.secretKey;
      this.confirmDialog1 = false;
      this.onAddNewUser();
    },
    onCloseNotFound() {
      this.confirmDialog1 = false;
    },
    onAddNewUser() {
      this.getAllUsers();
      this.layout = true;
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      let msg =
        rejectedEntries.length + "file(s) did not pass validation constraints";
      if (rejectedEntries[0].failedPropValidation == "max-file-size") {
        msg = "Please select file less then 2.5 MB.";
      }
      this.$q.notify({
        type: "negative",
        message: msg,
      });
    },
    clearFilter() {
      if (this.$refs.dept !== void 0) {
        this.$refs.dept.updateInputValue("");
      }
      this.selectDesignation();
    },
    selectDesignation() {
      const filterData = this.filterDesignationOptions
        .filter(
          (data) =>
            data.isActive && this.primaryDepartment?.id == data.departments,
        )
        .map((department) => ({
          id: department._id,
          label: department.name,
        }));

      this.designationOptions = [...filterData];
    },
    filterFnDepartments(val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredSecondryDepartments = this.secondaryDepartments.filter(
          (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1,
        );
      });
    },
    filterFnUsers(val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredUsers = this.users.filter(
          (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1,
        );
      });
    },
    googleEmailChange() {
      if (this.googleEmail[this.googleEmail.length - 1] == "@") {
        this.googleEmail += "gmail.com";
      }
    },
    genesisEmailChange() {
      if (this.genesisEmail[this.genesisEmail.length - 1] == "@") {
        this.genesisEmail += "genesistechnologies.in";
      }
    },
    close() {
      this.timesheetExemption = false;
      this.designation = null;
      this.apprDateErr = false;
      this.apprGradeDateErrorMassage = "";
      this.gradeDateErr = false;
      this.gradeDateErrorMassage = "";
      this.currentGradeDate = "";
      this.valpf = false;
      this.valnps = false;
      this.val = true;
      this.npsOptedDate = "";
      this.pfOptedDate = "";
      this.beneficiaryCode = null;
      this.uan = "";
      this.pran = "";
      this.bankName = null;
      this.ifsc = null;
      (this.account = null),
        (this.gross = null),
        // this.pfOpted=null;
        (this.npsOpt = null),
        (this.salaryGrade = ""),
        (this.pass = "password");
      this.layout = false;
      this.check = true;
      this.firstName = "";
      this.lastName = "";
      this.gender = "";
      this.mentor = "";
      this.genesisEmail = "";
      this.googleEmail = "";
      this.password = "";
      this.selectedUserType = null;
      this.selectSecondaryDepartments = [];
      this.primaryDepartment = null;
      this.secondaryDepartments = [];
      this.biometricId = "";
      this.skypeId = "";
      this.arr = [];
      this.userTypes = ["User", "Mentor", "Manager", "Admin"];
      this.msg = [];
      this.googlemsg = [];
      this.image = [];
      this.imageConverted =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
      this.blob = "";
      (this.empId = ""), (this.mobileNumber = "");
      this.date = "";
      this.dateofbirth = "";
      (this.actualBirthDate = ""), (this.nextAppraisalDate = "");
      this.lastAppraisalDate = "";
      this.userGrade = null;
      (this.panNumber = null), (this.adharNumber = null);
      (this.birthdayBlob = []),
        (this.file = ""),
        (this.birthdayImage = ""),
        (this.imageData = {});
      this.uploadedBirthdayImage =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    },
    convertDateInCalenderFormat(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
      var sdate = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
      return year + "/" + month + "/" + sdate;
    },
    change() {
      this.check = !this.check;
      this.pass = this.check ? "password" : "text";
    },
    async createBirthdayTemplateCard(user) {
      const currentYear = moment().format("YYYY");
      const birthDate = user.dates.actualBirthDate || user.dates.birthDate;
      const nextMonth = new Date();
      const currentYearBirthdate = moment(birthDate)
        .year(currentYear)
        .toISOString();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const birthDateObject = new Date(birthDate);

      //check condition for generate birthday template if newly added user's birthday is in current or next month
      if (
        currentYearBirthdate >= user.dates.createdDate &&
        birthDateObject.getMonth() <= nextMonth.getMonth() &&
        currentYearBirthdate >= user.dates.dateOfJoin
      ) {
        const res = await usersService.createBirthdayTemplateCard({
          userId: user._id,
        });
        if (res.data.ok) {
          this.successMsg = res.data.message;
        } else {
          this.errMsg = res.data.message;
          this.errorLayout = true;
        }
        this.$q.loading.hide();
      }
    },
    async onSubmit() {
      try {
        this.$refs.designationValidation.validate();
        this.$q.loading.show();
        const secondaryDepartmentsData = [
          this.primaryDepartment.id,
          ...this.selectSecondaryDepartments,
        ];
        const res = await usersService.addNewUser(
          {
            primaryDepartment: this.primaryDepartment.id,
            departments: secondaryDepartmentsData,
            deleted: false,
            userType: this.payrollOnly
              ? "user"
              : this.selectedUserType.toLowerCase(),
            password: this.payrollOnly ? "" : this.password,
            firstName: functions.capitalizeFirstLetter(this.firstName.trim()),
            lastName: functions.capitalizeFirstLetter(this.lastName.trim()),
            gender: this.gender.toLowerCase(),
            mobileNumber: this.mobileNumber,
            panNumber: this.panNumber,
            adharNumber: this.adharNumber
              ? Number(this.adharNumber.replaceAll("-", ""))
              : this.adharNumber,
            dates: {
              createdDate: new Date(
                new Date().setHours(0, 0, 0, 0),
              ).toISOString(),
              dateOfJoin: functions.convertDateToUTC(this.date),
              birthDate: functions.convertDateToUTC(this.dateofbirth),
              actualBirthDate: functions.convertDateToUTC(this.actualBirthDate),
              nextAppraisalDate: this.payrollOnly
                ? null
                : functions.convertDateToUTC(this.nextAppraisalDate),
              lastAppraisalDate: this.payrollOnly
                ? null
                : functions.convertDateToUTC(this.lastAppraisalDate ?? ""),
              currentGradeDate: this.payrollOnly
                ? null
                : functions.convertDateToUTC(this.currentGradeDate),
              npsOptedDate: this.valnps ? this.npsOptedDate : "",
              pfOptedDate: this.valpf ? this.pfOptedDate : "",
            },
            employeeId: this.empId,
            emails: {
              google: this.payrollOnly ? "" : this.googleEmail,
              genesis: this.payrollOnly ? "" : this.genesisEmail,
            },
            profileImageURL: this.imageConverted,
            mentor: this.payrollOnly ? null : this.mentor,
            description: "",
            biometricId: this.biometricId,
            grade: this.payrollOnly ? "" : this.userGrade,
            designation: this.designation.id,
            timesheetExemption: this.payrollOnly
              ? false
              : this.timesheetExemption,
            payrollOnly: this.payrollOnly,
            salaryGrade: this.val ? this.userGrade : this.salaryGrade,
            isPfOpted: this.valpf,
            uanNumber: this.valpf ? parseInt(this.uan) : null,
            isNps: this.valnps,
            npsPercent: this.valnps ? parseFloat(this.npsOpt.slice(0, -1)) : 0,
            pranNumber: this.valnps ? parseInt(this.pran) : null,
            bankName: this.bankName,
            ifscCode: this.ifsc,
            accountNo: String(this.account),
            beneficiaryCode: this.beneficiaryCode,
            URLs: {
              linkedIn: null,
              facebook: null,
              upwork: null,
              github: null,
              skype: this.payrollOnly ? null : this.skypeId,
            },
          },
          { file: this.blob },
        );

        const newSalaryPeriod = {
          user: res.data._id,
          payrollMonth: "",
          dates: {
            effectiveDateFrom: functions.convertDateToUTC(this.date),
          },
          masterSalary: {
            grade: this.val ? this.userGrade : this.salaryGrade,
            grossSalary: this.gross,
          },
          secretKey: this.secretKey,
          isUserComponent: true,
        };
        const result = await encryptDecrypt.encryptData(
          JSON.stringify(newSalaryPeriod.masterSalary),
          this.secretKey,
        );
        newSalaryPeriod.masterSalary = result;
        const updateRec =
          await salaryPeriod.setUserSalaryPeiod(newSalaryPeriod);
        if (res.status == 200) {
          this.$emit("submit", res.data._id);
          if (!this.payrollOnly) {
            await this.storeBirthdayTemplates(res.data._id);
            await this.createBirthdayTemplateCard(res.data);
          }
          await this.storeBirthdayTemplates(res.data._id);
          await this.createBirthdayTemplateCard(res.data);
        }
        this.$q.loading.hide();
        this.close();
        this.getAllUsers();
        this.layout = false;
        this.successMsg = "User Added Successfully!!";
      } catch (e) {
        console.log("error-->", e);
        this.errMsg = e.response.data.error;
        this.$q.loading.hide();
        this.errorLayout = true;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    async getAllDepartment() {
      const response = await departmentsService.fetchAllDepartment();
      const responseOfDesignation = await fetchAllDesignation();
      this.departments = response?.data
        .filter((department) => department.isActive)
        .map((department) => ({
          id: department._id,
          label: department.name,
        }));
      this.departments = this.departments.filter((department) =>
        responseOfDesignation.data.some(
          (designation) => designation.departments == department.id,
        ),
      );
      this.filteredPrimaryDepartments = [...this.departments];
      this.secondaryDepartments = this.departments.filter(
        (d) => d != this.primaryDepartment,
      );
    },

    async getAllUsers() {
      this.users = [];
      const response = await usersService.fetchUsers();
      response.data.forEach((user) => {
        if (user.userType != "user" && user.isActive == true)
          this.users.push({
            id: user._id,
            label: user.firstName + " " + user.lastName,
          });
      });
      this.filteredUsers = this.users;
    },
    async getAllDesignation() {
      const res = await fetchAllDesignation();
      this.filterDesignationOptions = res?.data;
    },
    onFileChange(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.showCropper = true;
        this.$nextTick(() => {
          this.$refs.imageCropper.src = e.target.result;
          if (this.cropperInstance) {
            this.cropperInstance.destroy();
          }
          this.$nextTick(() => {
            this.cropperInstance = new Cropper(this.$refs.imageCropper, {
              aspectRatio: 1,
              viewMode: 2,
              autoCropArea: 1,
            });
          });
        });
      };
      reader.readAsDataURL(file);
    },

    cropImage() {
      if (this.cropperInstance) {
        const croppedCanvas = this.cropperInstance.getCroppedCanvas();
        this.imageConverted = croppedCanvas.toDataURL("image/png");
        this.showCropper = false;
        this.cropperInstance.destroy();
      }
    },
    closeCropper() {
      this.showCropper = false;
      this.imageConverted =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
      this.image = null;
    },
  },
  async mounted() {
    await this.getAllDepartment();
    await this.getAllDesignation();
    await this.getAllUsers();
  },
};
</script>

<style scoped>
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}

.text {
  position: relative;
  top: 0px;
  left: 10px;
}
.checkbox {
  position: relative;
  left: 45px;
  bottom: 45px;
}
.textpf {
  position: relative;
  top: 0px;
  left: 10px;
}
.checkboxpf {
  position: relative;
  left: 45px;
  bottom: 45px;
}
.q-item,
.capital .q-field__native {
  text-transform: capitalize;
}
.full-width {
  height: 500px;
}
.image-cropper {
  width: 800px;
}
</style>
