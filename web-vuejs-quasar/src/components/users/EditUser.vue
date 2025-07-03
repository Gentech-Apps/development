<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-dialog
          v-model="layoutValue"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./users">
              <q-card style="width: 800px">
                <q-card-section class="q-pb-none">
                  <div
                    class="text-h6 text-center q-px-sm q-pb-md"
                    data-id="updateuserform-heading"
                  >
                    Update User
                  </div>
                </q-card-section>
                <div
                  style="max-height: 75vh; overflow-y: auto"
                  @scroll="scrollDropDown"
                >
                  <div class="">
                    <div class="row justify-center">
                      <div class="text-center">
                        <img
                          dense
                          :src="user.profileImageURL"
                          style="
                            border-radius: 10000px;
                            height: 100px;
                            width: 100px;
                          "
                          class=""
                        />
                      </div>
                    </div>
                    <div class="row justify-center">
                      <div class="" style="max-width: 250px">
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
                          class=""
                          @rejected="onRejected"
                          :readonly="
                            this.$store.getters.userType == 'manager'
                              ? true
                              : false
                          "
                          data-id="updateuser-selectprofilepicture"
                          @update:model-value="onImageChange"
                        >
                          <template>
                            <q-icon name="attachment" />
                          </template>
                        </q-file>
                      </div>
                      <q-dialog v-model="showCropper">
                        <q-card>
                          <q-card-section>
                            <div>
                              <div class="image-cropper">
                                <img ref="imageCropper" />
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
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="user.employeeId"
                        lazy-rules
                        label="Employee Id"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter employee id',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-employeeid"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="user.firstName"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter first name',
                        ]"
                        label="First Name"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-firstname"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="user.lastName"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter last name',
                        ]"
                        label="Last Name"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-lastname"
                      />
                    </div>
                  </div>

                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-select
                        outlined
                        dense
                        v-model="selectGender"
                        :options="['Male', 'Female']"
                        label="Select Gender"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please select Gender',
                        ]"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-selectgender"
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
                        @click="
                          $store.getters.userType !== 'manager'
                            ? $refs.qDateProxy.show()
                            : null
                        "
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter date of birth',
                        ]"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-dateofbirth"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                            v-if="$store.getters.userType !== 'manager'"
                          >
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="dateofbirth"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="updateuserdateofbirth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserdateofbirthcalendar-ok"
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
                        @click="$refs.qDateDob.show()"
                        data-id="updateuser-actualdateofbirth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateDob"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="actualBirthDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="updateuseractualdateofbirth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuseractualdateofbirthcalendar-ok"
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
                        v-model="date"
                        lazy-rules
                        label="Date of Joining"
                        dense
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        @click="
                          $store.getters.userType !== 'manager'
                            ? $refs.qDateJoining.show()
                            : null
                        "
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter date of joining',
                        ]"
                        data-id="updateuser-dateofjoining"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                            v-if="$store.getters.userType !== 'manager'"
                          >
                            <q-popup-proxy
                              ref="qDateJoining"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="date"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="updateuserdateofjoining-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserdateofjoiningcalendar-ok"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-pannumber"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="adharNumber"
                        lazy-rules
                        label="Aadhar Number"
                        mask="####-####-####"
                        :rules="[
                          (val) =>
                            /^[2-9]{1}[0-9]{3}([- ][0-9]{4}){2}$/.test(val) ||
                            'Please Enter 12 digits valid Aadhar Number.',
                        ]"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-adharnumber"
                      />
                    </div>
                  </div>

                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="user.biometricId"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-biometricid"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                      >
                      </q-select>
                    </div>

                    <div
                      class="q-gutter-md col-4 q-pl-md capital"
                      style="max-width: 300px"
                    >
                      <q-select
                        ref="editDept"
                        outlined
                        multiple
                        dense
                        v-model="selectDepartment"
                        use-input
                        input-debounce="0"
                        :options="filteredSecondaryDepartments"
                        @filter="filterFnDepartments"
                        label="Secondary Departments"
                        :rules="[checkSecondaryDepartmentValidations]"
                        map-options
                        option-value="id"
                        option-label="label"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-selectdepartment"
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
                  </div>

                  <div v-if="!this.payrollOnly" class="q-pl-lg q-mt-md row">
                    <div
                      v-if="!this.payrollOnly"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-selectgrade"
                      >
                      </q-select>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="userUserType"
                        :options="userTypes"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select user type',
                        ]"
                        label="Select User Type"
                        data-id="updateuser-selectusertype"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-select
                        outlined
                        dense
                        v-model="user.mentor"
                        use-input
                        input-debounce="0"
                        emit-value
                        map-options
                        :options="filteredUsers"
                        @filter="filterFnUsers"
                        label="Select Mentor"
                        option-value="id"
                        option-label="label"
                        data-id="updateuser-selectmentor"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select a Mentor.',
                        ]"
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
                    <div class="q-pl-md">
                      <q-checkbox
                        v-model="isLead"
                        label="Lead"
                        v-if="user.userType !== 'user'"
                        data-id="updateuser-leadcheckbox"
                        size="sm"
                      />
                    </div>
                  </div>

                  <div v-if="!this.payrollOnly" class="q-pl-lg q-mt-md row">
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-skypeid"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-input
                        readonly
                        outlined
                        dense
                        type="email"
                        v-model="user.emails.genesis"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-genesisemail"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-input
                        outlined
                        dense
                        type="email"
                        v-model="user.emails.google"
                        label="Google Email"
                        @update:model-value="googleEmailChange"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-googleemail"
                      />
                    </div>
                  </div>
                  <div v-if="!this.payrollOnly" class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        v-model="currentGradeDate"
                        label="Current Grade Date"
                        lazy-rules
                        dense
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Current Grade date',
                          (val) =>
                            UTCToDateFormatter(this.currentGradeDate) >=
                              UTCToDateFormatter(this.date) ||
                            'Current Grade Date should not be less than Date of Joining',
                        ]"
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        @click="$refs.qCurrentGradeDate.show()"
                        data-id="updateuser-currentgradedate"
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
                                data-id="updateusercurrentgradedate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateusercurrentgradedatecalendar-ok"
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
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        @click="$refs.qLastAppraisalDate.show()"
                        data-id="updateuser-lastappraisaldate"
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
                                data-id="updateuserlastappraisaldate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserlastappraisaldatecalendar-ok"
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
                        v-model="nextAppraisalDate"
                        label="Next Appraisal Date"
                        dense
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        :error="apprDateErr"
                        :error-message="apprGradeDateErrorMassage"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Next Appraisal date',
                          (val) =>
                            !UTCToDateFormatter(this.lastAppraisalDate) ||
                            UTCToDateFormatter(this.nextAppraisalDate) >
                              UTCToDateFormatter(this.lastAppraisalDate) ||
                            'Next Appraisal Date should not be less than Last Appraisal Date',
                        ]"
                        @click="$refs.qNextAppraisalDate.show()"
                        data-id="updateuser-nextappraisaldate"
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
                                data-id="updatenextappraisaldate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    :disable="
                                      this.$store.getters.userType == 'manager'
                                        ? true
                                        : false
                                    "
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updatenextappraisaldatecalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div
                    class="q-pl-lg q-mt-md row"
                    v-if="$store.getters.userType == 'admin'"
                  >
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="bankName"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Please enter Bank name',
                        ]"
                        label="Bank Name"
                        data-id="updateuser-bankname"
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
                        data-id="updateuser-ifsccode"
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
                        mask
                        :rules="[
                          (value) =>
                            (value &&
                              value.length >= 8 &&
                              value.length <= 17) ||
                            'Please enter Account Number(Between 8 to 17 digit)',
                          (value) =>
                            /^[0-9]*$/.test(value) ||
                            'Please Enter Numbers Only',
                        ]"
                        label="Account Number"
                        data-id="updateuser-accountnumber"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        dense
                        v-model="user.mobileNumber"
                        type="tel"
                        mask="##########"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.toString().length === 10) ||
                            (payrollOnly && (!val || val.length === 10)) ||
                            'Please enter valid Mobile Number',
                          (val) =>
                            /^[1-9]\d{9}$/.test(val) ||
                            (payrollOnly &&
                              (!val || /^[1-9]\d{9}$/.test(val))) ||
                            'Mobile Number can not start with 0.',
                        ]"
                        label="Mobile Number"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-mobilenumber"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                      v-if="$store.getters.userType == 'admin'"
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
                        label="Beneficiary Code"
                        data-id="updateuser-beneficiarycode"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md capital"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="designation"
                        :options="designationOptions"
                        label="Designation"
                        option-value="id"
                        option-label="label"
                        ref="designationRef"
                        :rules="[checkDesignationValidations]"
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        data-id="updateuser-designation"
                      >
                      </q-select>
                    </div>
                  </div>

                  <div v-if="!this.payrollOnly" class="q-pl-lg row">
                    <div class="q-gutter-md col-4">
                      <q-checkbox
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        class=""
                        size="sm"
                        v-model="isOnNoticePeriod"
                        @update:model-value="checkLoanOnNoticePeriod"
                        val="true"
                        label="On Notice Period"
                        data-id="updateuser-onnoticeperiodcheckbox"
                      />
                    </div>
                    <div class="q-gutter-md col-4 q-pl-md">
                      <q-checkbox
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        class=""
                        size="sm"
                        v-model="isEligibleForSpecialLeave"
                        val="true"
                        label="Eligible For Special Leave"
                        data-id="updateuser-eligibleforspecialleavecheckbox"
                      />
                    </div>
                    <div
                      v-if="!this.payrollOnly"
                      class="q-gutter-md col-4"
                      style="max-width: 300px"
                    >
                      <q-checkbox
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        v-model="timesheetExemption"
                        label="Timesheet Exemption"
                        data-id="updateuser-timesheetexemptioncheckbox"
                        size="sm"
                      />
                    </div>
                  </div>
                  <div
                    class="q-pl-lg row"
                    v-if="isOnNoticePeriod && !activeLoanStatus"
                  >
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-input
                        outlined
                        v-model="resigningDate"
                        lazy-rules
                        label="Resigning Date"
                        dense
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        @click="
                          $store.getters.userType !== 'manager'
                            ? $refs.qResigningDateProxy.show()
                            : null
                        "
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter resigning date',
                        ]"
                        data-id="updateuser-resigningdate"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                            v-if="$store.getters.userType !== 'manager'"
                          >
                            <q-popup-proxy
                              ref="qResigningDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="resigningDateVar"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="updateuserresigningdate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserresigningdatecalendar-ok"
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
                        v-model="relievingDate"
                        label="Relieving Date"
                        dense
                        :disable="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        @click="
                          $store.getters.userType !== 'manager'
                            ? $refs.qDateRelievingProxy.show()
                            : null
                        "
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter relieving date',
                          (val) =>
                            UTCToDateFormatter(this.relievingDate) >=
                              UTCToDateFormatter(this.resigningDate) ||
                            'Relieving Date should not be less than Resigning Date',
                        ]"
                        data-id="updateuser-relievingdate"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                            v-if="$store.getters.userType !== 'manager'"
                          >
                            <q-popup-proxy
                              ref="qDateRelievingProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="relievingDate"
                                minimal
                                mask="DD/MM/YYYY"
                                data-id="updateuserrelievingdate-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserrelievingdatecalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div
                    class="q-pl-lg q-mt-md row"
                    v-if="$store.getters.userType == 'admin'"
                  >
                    <div class="q-gutter-md col-4" style="max-width: 300p">
                      <q-checkbox
                        :disable="isPfOpted == true || userGrade == 'G1'"
                        v-model="valpf"
                        label="PF Opted by User"
                        data-id="updateuser-pfoptedbyusercheckbox"
                        size="sm"
                      />
                    </div>
                    <div
                      v-if="valpf == true"
                      class="q-gutter-md col-4"
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
                            val.length === 0 ||
                            val.length === 12 ||
                            'Please enter UAN number(12 Digit)',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="UAN Number"
                        data-id="updateuser-uannumber"
                      />
                    </div>
                    <div
                      v-if="valpf == true"
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                      :aria-disabled="pfOptedDate"
                    >
                      <q-input
                        outlined
                        v-model="pfOptedDate"
                        lazy-rules
                        label="PF Opted Month"
                        dense
                        readonly
                        v-bind:disable="
                          pfOptedDate !== '' && checkPreviousFilledPf !== ''
                        "
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select PF Opted Month.',
                          (val) =>
                            (val && checkPfOPted()) ||
                            'PF opted month should not be less than date of joining.',
                        ]"
                        @click="$refs.qShowCal.show()"
                        data-id="updateuser-pfoptedmonth"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qShowCal"
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
                                data-id="updateuserpfoptedmonth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateuserpfoptedmonthcalendar-ok"
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div
                    class="q-pl-lg q-mt-md row"
                    v-if="$store.getters.userType == 'admin'"
                  >
                    <div class="q-gutter-md col-4" style="max-width: 300px">
                      <q-checkbox
                        :disable="isNpsOpted || userGrade == 'G1'"
                        v-model="valnps"
                        label="NPS Opted by User"
                        data-id="updateuser-npsoptedbyusercheckbox"
                        size="sm"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row" id="scrollId">
                    <div
                      v-if="valnps == true"
                      class="q-gutter-md col-4"
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
                        data-id="updateuser-npspercentage"
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
                        data-id="updateuser-prannumber"
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
                        v-bind:disable="
                          npsOptedDate !== '' && checkPreviousFilledNps !== ''
                        "
                        dense
                        readonly
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select Nps Opted Month.',
                          (val) =>
                            (val && checkNpsOpted()) ||
                            'Nps opted month should not be less than date of joining.',
                        ]"
                        @click="$refs.qNPSDate.show()"
                        data-id="updateuser-npsoptedmonth"
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
                                data-id="updateusernpsoptedmonth-calendar"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                    data-id="updateusernpsoptedmonthcalendar-ok"
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
                        :readonly="
                          this.$store.getters.userType == 'manager'
                            ? true
                            : false
                        "
                        :rules="[checkBirthdayImage]"
                        data-id="updateuser-selectbirthdayimage"
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
                      data-id="updateuser-cancelbutton"
                    />
                    <q-btn
                      flat
                      type="submit"
                      color="primary"
                      label="Submit"
                      :disabled="
                        (!user.isActive && user.dates.relievingDate) ||
                        this.activeLoanStatus
                      "
                      data-id="updateuser-submitbutton"
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

          <q-dialog
            v-model="isOnNoticePeriodPopup"
            persistent
            transition-show="scale"
            transition-hide="scale"
          >
            <q-card class="q-pb-none popup-width">
              <q-card-section class="q-pb-none">
                <div class="col-4 announcement-col">
                  <div
                    class="text-h6 text-center q-px-sm q-pb-md"
                    data-id="notice-period"
                  >
                    Items need to be closed
                  </div>
                  <div class="overflow-auto max-height">
                    <div
                      v-for="iterator in itemsNeedToBeClosed"
                      :key="iterator.key"
                    >
                      <div>
                        <q-item clickable class="row item-size">
                          <q-item-section clickable class="col=10 text-size">
                            {{ iterator.key }}
                          </q-item-section>
                          <q-item-section
                            clickable
                            class="col-2 text-align-right"
                          >
                            {{ iterator.value }}
                          </q-item-section>
                        </q-item>
                        <q-separator class="q-mx-auto change-separator" />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Close"
                  color="primary"
                  @click="isOnNoticePeriodPopup = false"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-dialog>
      </div>
    </div>
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
import { capitalize, ref } from "vue";
import ImagePreview from "../../components/Profile/ImagePreview";
import * as departmentsService from "../../services/departments.service";
import { fetchAllDesignation } from "../../services/designations.service";
import * as functions from "../../services/functions";
import * as loanService from "../../services/loan.service";
import * as usersService from "../../services/users.service";
import Notify from "../Notify.vue";

export default {
  components: { Notify, ImagePreview },
  data() {
    return {
      formData: new FormData(),
      file: "",
      imagePreviewOpen: false,
      imageData: "",
      birthdayBlob: [],
      payrollOnly: false,
      timesheetExemption: false,
      designation: "",
      checkPreviousFilledPf: "",
      checkPreviousFilledNps: "",
      minpfOptedMonth: "",
      minNpsOptedMonth: "",
      beneficiaryCode: null,
      pfOptedDate: null,
      prevPfOptedDate: "",
      prevNpsOptedDate: "",
      bankName: null,
      ifsc: null,
      account: null,
      npsOpt: ref("7.5%"),
      npsOptedDate: null,
      valnps: ref(false),
      uan: "",
      pran: "",
      valpf: ref(false),
      isPfOpted: null,
      isNpsOpted: null,
      salaryGrade: null,
      resigningDateVar: "",
      resigningDate: "",
      gradeDateErr: false,
      gradeDateErrorMassage: "",
      apprDateErr: false,
      apprGradeDateErrorMassage: "",
      pfOptedDateErr: false,
      pfOptedDateErrorMassage: "",
      npsOptedDateErr: false,
      npsOptedDateErrorMassage: "",
      layoutValue: false,
      pass: "password",
      check: true,
      firstName: "",
      lastName: "",
      users: [],
      filteredUsers: [],
      mentor: "",
      genesisEmail: "",
      googleEmail: "",
      password: "",
      errorLayout: false,
      today: new Date(),
      selectDepartment: [],
      skypeId: "",
      nextAppraisalDate: "",
      lastAppraisalDate: "",
      filteredDepartments: [],
      selectGender: "",
      userGrade: null,
      gradeOptions: ["G1", "G2", "G3", "G4"],
      designationOptions: [],
      isEligibleForSpecialLeave: false,
      isOnNoticePeriod: false,
      departments: [],
      departmentsData: [],
      arr: [],
      userTypes: ["User", "Mentor", "Manager", "Admin"],
      msg: [],
      errMsg: "",
      googlemsg: [],
      image: [],
      date: "",
      dateofbirth: "",
      relievingDate: "",
      isLead: false,
      user: {
        emails: { genesis: null, google: null },
        dates: { dateOfJoin: null },
        userTypes: "",
      },
      imageConverted:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      uploadedBirthdayImage:
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
      blob: "",
      successMsg: "",
      currentGradeDate: null,
      adharNumber: null,
      panNumber: null,
      activeLoanStatus: false,
      actualBirthDate: "",
      birthdayImage: [],
      filterDesignationOptions: [],
      isPendingEmis: false,
      primaryDepartment: null,
      filteredPrimaryDepartments: [],
      filteredSecondaryDepartments: [],
      secondaryDepartments: [],
      showCropper: false,
      cropperInstance: null,
      isOnNoticePeriodPopup: false,
      itemsNeedToBeClosed: [
        { key: "Pending timesheets: ", value: 0 },
        { key: "Missing timesheets: ", value: 0 },
        { key: "Pending leaves requests: ", value: 0 },
        { key: "Active loan: ", value: 0 },
      ],
    };
  },
  computed: {
    userUserType: {
      get() {
        if (this.user.userType)
          return (
            this.user.userType.substring(0, 1).toUpperCase() +
            this.user.userType
              .substring(1, this.user.userType.length)
              .toLowerCase()
          );
        else return null;
      },
      set(value) {
        this.user.userType = value.toLowerCase();
      },
    },
  },
  watch: {
    isOnNoticePeriod: function (val) {
      if (!this.user.isOnNoticePeriod && val) {
        this.checkUserForNoticePeriod(val);
      }
    },
    userGrade: function (newVal) {
      if (newVal == "G1") {
        this.isPfOpted = false;
        this.isNpsOpted = false;
        this.npsOptedDate = "";
        this.npsOpt = ref("7.5%");
        this.valnps = false;
        this.pfOptedDate = "";
        this.uan = "";
        this.pran = "";
        this.valpf = false;
      }
      if (this.valpf && this.prevPfOptedDate == "" && newVal == "G1") {
        this.valpf = false;
      }
      if (this.valnps && this.prevNpsOptedDate == "" && newVal == "G1") {
        this.valnps = false;
      }
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
    date: function (newVal) {
      var datearray = this.date.split("/");
      var newdatemodified = datearray[2] + "/" + datearray[1];
      this.minNpsOptedMonth = newdatemodified;
      this.minPfOptedMonth = newdatemodified;
    },
    nextAppraisalDate: function (val) {
      if (
        this.nextAppraisalDate &&
        new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        this.apprGradeDateErrorMassage =
          "Next Appraisal date should not be less than Date of Joining.";
        this.apprDateErr = true;
      } else if (
        this.nextAppraisalDate &&
        !new Date(functions.convertDateToUTC(this.nextAppraisalDate)).setHours(
          0,
          0,
          0,
          0,
        ) < new Date(functions.convertDateToUTC(this.date)).setHours(0, 0, 0, 0)
      ) {
        this.apprGradeDateErrorMassage = "";
        this.apprDateErr = false;
      } else if (!this.nextAppraisalDate) {
        this.apprGradeDateErrorMassage = "Select Next Appraisal date.";
        this.apprDateErr = true;
      }
    },
    resigningDateVar: function (val) {
      if (val != "" && val != null && val != undefined) {
        this.resigningDate = val;
        const date = moment(
          moment(functions.convertDateToUTC(val))
            .add(2, "months")
            .subtract(1, "days"),
        );
        if (new Date(date).getDay() == 6) {
          this.relievingDate = moment(
            new Date(moment(date).subtract(1, "days")),
          ).format("DD/MM/YYYY");
        } else if (new Date(date).getDay() == 0) {
          this.relievingDate = moment(
            new Date(moment(date).subtract(2, "days")),
          ).format("DD/MM/YYYY");
        } else {
          this.relievingDate = moment(new Date(date)).format("DD/MM/YYYY");
        }
      }
    },
    layout: function (newVal) {
      this.layoutValue = newVal;
    },
    image: function (newVal) {
      if (newVal != "" && newVal != undefined) {
        this.onImageChange(newVal);
      }
    },
    birthdayImage: function (newVal) {
      if (newVal != "" && newVal != undefined) {
        this.changeEvent(newVal);
      }
    },
    userId: async function (value) {
      await this.getAllUsers();
      if (value && this.$store.getters.userType == "admin") {
        const res = await loanService.isEMIPending(value);
        this.isPendingEmis = res.data.result;

        const response =
          await usersService.fetchUserPendingTimesheetCountAndPendingLeaveCountAndMissingTimesheetCount(
            { userId: value },
          );
        this.itemsNeedToBeClosed[0].value =
          response?.data.pendingTimesheetCount;
        this.itemsNeedToBeClosed[1].value =
          response?.data.missingTimesheetCount;
        this.itemsNeedToBeClosed[2].value = response?.data.pendingLeaveCount;
        this.itemsNeedToBeClosed[3].value = this.isPendingEmis ? 1 : 0;
      }

      const response = await usersService.fetchUserByID(value);
      if (response != undefined) {
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const REGION = process.env.REGION;
        const ENVIRONMENT = process.env.ENV;
        this.user = response.data[0];
        this.payrollOnly = this.user.payrollOnly;
        this.adharNumber = this.user?.adharNumber;
        this.panNumber = this.user?.panNumber;
        if (this.user.birthdayImages.length) {
          const defaultImages = this.user.birthdayImages.filter(
            (image) => image.isDefault,
          );
          if (defaultImages.length > 0) {
            this.preparedBlobArray();
            defaultImages.forEach((image) => {
              if (image.fileName) {
                this.file = image.fileName;
                this.uploadedBirthdayImage = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${ENVIRONMENT}/${this.userId}/gallery/${image.fileName}`;
              } else {
                this.file = "";
              }
            });
          } else {
            this.file = "";
          }
        }
        if (this.user.grade) {
          this.userGrade = this.user.grade;
        } else {
          this.userGrade = null;
        }
        if (this.user.designation) {
          this.designation = {
            id: this.user.designation._id,
            label: this.user.designation.name,
          };
        } else {
          this.designation = [];
        }
        if (this.user.timesheetExemption) {
          this.timesheetExemption = this.user.timesheetExemption;
        } else {
          this.timesheetExemption = false;
        }
        if (this.user.beneficiaryCode) {
          this.beneficiaryCode = this.user.beneficiaryCode;
        } else {
          this.beneficiaryCode = null;
        }
        if (this.user.bankName) {
          this.bankName = this.user.bankName;
        } else {
          this.bankName = null;
        }
        if (this.user.ifscCode) {
          this.ifsc = this.user.ifscCode;
        } else {
          this.ifsc = null;
        }
        if (this.user.accountNo) {
          this.account = this.user.accountNo.toString();
        } else {
          this.account = null;
        }
        if (this.user.isPfOpted) {
          this.isPfOpted = this.user.isPfOpted;
          this.valpf = this.isPfOpted;
        } else {
          this.isPfOpted = false;
          this.valpf = false;
        }
        if (this.user.isNps) {
          this.isNpsOpted = this.user.isNps;
          this.valnps = this.user.isNps;
        } else {
          this.isNpsOpted = this.user.isNps;
          this.valnps = false;
        }
        if (this.user.npsPercent) {
          this.npsOpt = this.user.npsPercent + "%";
        }
        if (this.user.dates.npsOptedDate !== "") {
          this.npsOptedDate = this.user.dates.npsOptedDate;
          this.checkPreviousFilledNps = this.npsOptedDate;
          this.prevNpsOptedDate = this.npsOptedDate;
        } else {
          this.npsOptedDate = "";
          this.checkPreviousFilledNps = "";
        }
        if (this.user.dates.pfOptedDate !== "") {
          this.pfOptedDate = this.user.dates.pfOptedDate;
          this.checkPreviousFilledPf = this.pfOptedDate;
          this.prevPfOptedDate = this.pfOptedDate;
        } else {
          this.pfOptedDate = "";
          this.checkPreviousFilledPf = "";
        }
        if (this.user.uanNumber != null) {
          this.uan = this.user.uanNumber.toString();
        } else {
          this.uan = "";
        }
        if (this.user.pranNumber != null) {
          this.pran = this.user.pranNumber.toString();
        } else {
          this.pran = "";
        }
        if (this.user.dates.currentGradeDate) {
          this.currentGradeDate = functions.convertUTCToDate(
            this.user.dates.currentGradeDate,
          );
        } else {
          this.currentGradeDate = null;
        }
        if (this.user.isEligibleForSpecialLeave) {
          this.isEligibleForSpecialLeave = this.user.isEligibleForSpecialLeave;
        } else {
          this.isEligibleForSpecialLeave = false;
        }
        if (this.user.isOnNoticePeriod) {
          this.isOnNoticePeriod = this.user.isOnNoticePeriod;
        } else {
          this.isOnNoticePeriod = false;
        }

        this.user.isOnNoticePeriod = this.isOnNoticePeriod;
        this.user.employeeId = JSON.stringify(this.user.employeeId);
        if (this.user.biometricId == null) {
          this.user.biometricId = "";
        } else {
          this.user.biometricId = JSON.stringify(this.user.biometricId);
        }
        if (this.user?.primaryDepartment) {
          this.primaryDepartment = {
            id: this.user?.primaryDepartment?._id,
            label: this.user?.primaryDepartment?.name,
          };
        } else {
          this.primaryDepartment = { id: "", label: "" };
        }
        this.skypeId = this.user.URLs.skype;
        this.selectDepartment = [];
        this.user.departments.forEach((department) => {
          if (department._id != this.primaryDepartment?.id) {
            this.selectDepartment.push({
              id: department._id,
              label: department.name,
            });
          }
        });
        this.secondaryDepartments = this.departments.filter(
          (d) => d.id != this.primaryDepartment?.id,
        );
        this.filteredSecondaryDepartments = this.secondaryDepartments;
        if (
          this.user.dates.dateOfJoin == null ||
          this.user.dates.dateOfJoin == ""
        ) {
          this.user.dates.dateOfJoin = "";
        } else {
          this.date = functions.convertUTCToDate(this.user.dates.dateOfJoin);
        }
        if (this.user.gender != "" || this.user.gender != null) {
          this.selectGender = capitalize(this.user.gender);
        } else {
          this.selectGender = "";
        }

        if (
          this.user.dates.resigningDate == null ||
          this.user.dates.resigningDate == ""
        ) {
          this.user.dates.resigningDate = "";
        } else {
          this.resigningDate = functions.convertUTCToDate(
            this.user.dates.resigningDate,
          );
          this.resigningDateVar = functions.convertUTCToDate(
            this.user.dates.resigningDate,
          );
        }

        if (
          this.user.dates.relievingDate == null ||
          this.user.dates.relievingDate == ""
        ) {
          this.user.dates.relievingDate = "";
        } else {
          setTimeout(() => {
            this.relievingDate = functions.convertUTCToDate(
              this.user.dates.relievingDate,
            );
          }, 500);
        }

        if (
          this.user.dates.birthDate == null ||
          this.user.dates.birthDate == ""
        ) {
          this.user.dates.birthDate = "";
        } else {
          // console.log(this.user.dates.birthDate ,   ' DOB')
          this.dateofbirth = functions.convertUTCToDate(
            this.user.dates.birthDate,
          );
        }
        if (
          this.user.dates.actualBirthDate == null ||
          this.user.dates.actualBirthDate == ""
        ) {
          this.user.dates.actualBirthDate = "";
        } else {
          this.actualBirthDate = functions.convertUTCToDate(
            this.user.dates.actualBirthDate,
          );
        }
        if (
          this.user.dates.nextAppraisalDate == null ||
          this.user.dates.nextAppraisalDate == ""
        ) {
          this.user.dates.nextAppraisalDate = "";
        } else {
          this.nextAppraisalDate = functions.convertUTCToDate(
            this.user.dates.nextAppraisalDate,
          );
        }
        if (
          this.user.dates.lastAppraisalDate == null ||
          this.user.dates.lastAppraisalDate == ""
        ) {
          this.user.dates.lastAppraisalDate = "";
        } else {
          this.lastAppraisalDate = functions.convertUTCToDate(
            this.user.dates.lastAppraisalDate,
          );
        }
        this.user.isLead
          ? (this.isLead = this.user.isLead)
          : (this.isLead = false);
        this.selectDesignation();
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
    checkUserForNoticePeriod(val) {
      if (
        this.itemsNeedToBeClosed[0].value != 0 ||
        this.itemsNeedToBeClosed[1].value != 0 ||
        this.itemsNeedToBeClosed[2].value != 0 ||
        this.itemsNeedToBeClosed[3].value != 0
      ) {
        this.isOnNoticePeriod = false;
        this.isOnNoticePeriodPopup = true;
      }
    },
    primaryDepartmentValidations(val) {
      this.$refs.designationRef.validate();
      const filteredData = this.departmentsData.filter(
        (d) => d._id == val?.id && d.isActive,
      );
      if (!val || val?.length == 0) return "Please select primary department";
      if (filteredData.length <= 0) return "Please select a valid department";
      this.secondaryDepartments = this.departments.filter(
        (d) => d.id != val?.id,
      );
      this.filteredSecondaryDepartments = [...this.secondaryDepartments];
      this.selectDepartment = this.selectDepartment.filter(
        (d) => d.id != val?.id,
      );
      return true;
    },
    checkSecondaryDepartmentValidations(val) {
      const filteredData = val?.filter((d) =>
        this.departmentsData.some((d1) => d.id == d1._id && !d1.isActive),
      );
      if (filteredData.length > 0) return "Please select a valid department";
      return true;
    },
    checkDesignationValidations(val) {
      if (!val) return "Please select a valid designation";
      let value;
      if (typeof val === "object") value = val?.label;
      else value = val;
      const designationsOfSelectedPrimaryDepartment =
        this.filterDesignationOptions.filter(
          (d) => d.Data.name == this.primaryDepartment?.label,
        );
      if (
        designationsOfSelectedPrimaryDepartment == undefined ||
        designationsOfSelectedPrimaryDepartment?.length <= 0
      ) {
        return "Please select a valid designation";
      }
      const designations = designationsOfSelectedPrimaryDepartment?.find(
        (d) => d.name == value && d.isActive,
      );
      if (designations == undefined || designations?.length <= 0)
        return "Please select a valid designation";
      return true;
    },
    checkBirthdayImage() {
      if (this.file.length === 0) {
        return "Please Select Birthday Image";
      } else {
        return true;
      }
    },
    preparedBlobArray() {
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const REGION = process.env.REGION;
      const ENVIRONMENT = process.env.ENV;
      this.user?.birthdayImages?.forEach(async (birthdayImage, i) => {
        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${ENVIRONMENT}/${this.$store.getters.userId}/gallery/${birthdayImage.fileName}`;
        if (birthdayImage.isDefault) {
          this.birthdayBlob.push({
            index: i,
            fileName: birthdayImage.fileName,
            blobFile: new Blob([url], { type: "image/png" }),
            blobUrl: url,
          });
        }
      });
    },
    async storeBirthdayTemplates() {
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const REGION = process.env.REGION;
      const ENVIRONMENT = process.env.ENV;
      this.$q.loading.show();
      this.formData.append("userId", this.userId);
      this.formData.append("isDefault", true);
      const res = await usersService.uploadImageByUser(this.formData);
      if (res.status == 200) {
        if (res.data.ok) {
          this.successMsg = res.data.message;
          this.errMsg = "";
          this.errorLayout = false;
          this.user.birthdayImages = res?.data?.userData?.birthdayImages;
          const defaultImages = res?.data?.userData?.birthdayImages?.filter(
            (image) => image.isDefault,
          );
          if (defaultImages && defaultImages.length > 0) {
            defaultImages.forEach((image) => {
              if (image.fileName) {
                this.uploadedBirthdayImage = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${ENVIRONMENT}/${this.userId}/gallery/${image.fileName}`;
              }
            });
          }
        } else {
          this.successMsg = "";
          this.errMsg = res.data.message;
          this.errorLayout = true;
        }
        this.closePreviewModel();
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
      this.storeBirthdayTemplates();
    },
    async previewSubmitModel(data) {
      this.birthdayBlob.push({
        index: data.index,
        fileName: data.fileName,
        blobFile: new Blob([data.blobFile], { type: "image/png" }),
        blobUrl: data.blobUrl,
      });
      await this.setBlobToFormData(data.index);
    },
    closePreviewModel() {
      (this.birthdayBlob = []), (this.birthdayImage = "");
      this.imageData = {};
      this.imagePreviewOpen = false;
      this.formData.delete("file");
      this.formData.delete("userId");
      this.formData.delete("isDefault");
    },
    eventCalling() {
      if (this.birthdayBlob.length > 0) {
        const res = this.birthdayBlob.filter((data) => {
          return data.fileName.toString() == this.file.name.toString();
        });

        if (res.length > 0) {
          this.file = "";
          this.errMsg = "Duplicates files should Not Be Used.";
          this.errorLayout = true;
          this.birthdayImage = "";
          return false;
        }
      }
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
          height = this.height;
          width = this.width;
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

    async checkLoanOnNoticePeriod() {
      this.isOnNoticePeriod
        ? (this.activeLoanStatus = this.isPendingEmis)
        : (this.activeLoanStatus = false);
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
    checkFirstNumber() {},
    UTCToDateFormatter(utcDate) {
      if (utcDate) {
        var date = moment(utcDate, "DD/MM/YYYY");
        return new Date(date).getTime();
      } else {
        return false;
      }
    },
    scrollDropDown() {
      functions.DropDownScroll();
    },
    onRejected(rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      let msg =
        rejectedEntries.length + "file(s) did not pass validation constraints";
      if (rejectedEntries[0].failedPropValidation == "max-file-size") {
        msg = "Please select file less 2.5mb.";
      }
      this.$q.notify({
        type: "negative",
        message: msg,
      });
    },
    clearFilter() {
      if (this.$refs.editDept !== void 0) {
        this.$refs.editDept.updateInputValue("");
      }

      this.selectDesignation();
    },
    selectDesignation() {
      this.selectDepartment.map((d) => d.id);
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
    googleEmailChange() {
      if (this.user.emails.google[this.user.emails.google.length - 1] == "@") {
        this.user.emails.google += "gmail.com";
      }
    },
    genesisEmailChange() {
      if (
        this.user.emails.genesis[this.user.emails.genesis.length - 1] == "@"
      ) {
        this.user.emails.genesis += "genesistechnologies.in";
      }
    },
    close() {
      this.user = {
        emails: { genesis: null, google: null },
        dates: { dateOfJoin: null },
        userTypes: "",
      };
      (this.primaryDepartment = null),
        (this.secondaryDepartments = []),
        (this.blob = "");
      this.timesheetExemption = false;
      this.designation = [];
      this.checkPreviousFilledPf = "";
      this.checkPreviousFilledNps = "";
      this.uan = "";
      this.pran = "";
      this.beneficiaryCode = null;
      this.prevPfOptedDate = "";
      this.prevNpsOptedDate = "";
      this.pfOptedDate = null;
      this.npsOptedDate = null;
      this.bankName = null;
      this.ifsc = null;
      this.account = null;
      this.salaryGrade = null;
      this.isPfOpted = null;
      this.isNpsOpted = null;
      this.date = "";
      this.dateofbirth = "";
      this.actualBirthDate = "";
      this.nextAppraisalDate = "";
      this.lastAppraisalDate = "";
      this.relievingDate = "";
      this.resigningDate = "";
      this.resigningDateVar = "";
      this.skypeId = "";
      this.image = [];
      this.currentGradeDate = null;
      this.userGrade = null;
      this.panNumber = null;
      this.adharNumber = null;
      this.$emit("layoutFalse");
      this.file = "";
      this.activeLoanStatus = false;
      this.uploadedBirthdayImage =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    },
    filterFnDepartments(val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredSecondaryDepartments = this.secondaryDepartments.filter(
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
    change() {
      this.check = !this.check;
      this.pass = this.check ? "password" : "text";
    },
    async onSubmit() {
      const selectedSecondaryDepartments = [
        this.primaryDepartment,
        ...this.selectDepartment,
      ];
      const newUser = {
        dates: {
          resigningDate: functions.convertDateToUTC(this.resigningDate),
          relievingDate: functions.convertDateToUTC(this.relievingDate),
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
        gender: this.selectGender.toLowerCase(),
        isEligibleForSpecialLeave: this.payrollOnly
          ? false
          : this.isEligibleForSpecialLeave,
        isOnNoticePeriod: this.payrollOnly ? false : this.isOnNoticePeriod,
        URLs: {
          skype: this.payrollOnly ? null : this.skypeId,
        },
        isLead: this.payrollOnly ? false : this.isLead,
        grade: this.userGrade,
        designation: this.designation.id,
        timesheetExemption: this.payrollOnly ? false : this.timesheetExemption,
        bankName: this.bankName,
        ifscCode: this.ifsc,
        accountNo: String(this.account),
        beneficiaryCode: this.beneficiaryCode,
        uanNumber: this.valpf ? this.uan : null,
        isNps: this.valnps,
        npsPercent: this.valnps ? this.npsOpt.slice(0, -1) : 0,
        pranNumber: this.valnps ? this.pran : null,
        isPfOpted: this.valpf ? this.valpf : this.isPfOpted,
        panNumber: this.panNumber,
        adharNumber: this.adharNumber
          ? Number(this.adharNumber.replaceAll("-", ""))
          : "",
        primaryDepartment: this.primaryDepartment.id,
        departments: selectedSecondaryDepartments.map(
          (department) => department.id,
        ),
        payrollOnly: this.payrollOnly,
      };
      const sanatisedUser = this.removeEmpty(newUser);
      this.user.firstName = this.user.firstName.trim();
      this.user.lastName = this.user.lastName.trim();
      const UserData = {
        ...this.user,
        ...sanatisedUser,
      };
      try {
        this.$q.loading.show();
        const res = await usersService.updateUserByID(this.userId, UserData, {
          file: this.blob,
        });
        if (
          this.isOnNoticePeriod &&
          this.relievingDate &&
          this.$store.getters.userType == "admin"
        ) {
          const res1 = await usersService.updateAppraisalByNoticePeriod(
            this.userId,
          );
          const res2 = await usersService.generateMediclaimDeductionCard(
            this.userId,
          );
        }
        if (res.status == 200) {
          this.$emit("editLayout", this.userId);
        }
        this.$q.loading.hide();
        this.close();
        this.successMsg = "User Updated Successfully!!";
        this.getAllUsers();
      } catch (e) {
        this.errMsg = e?.response?.data?.error;
        this.$q.loading.hide();
        this.errorLayout = true;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    async getAllDepartment() {
      const response = await departmentsService.fetchAllDepartment();
      this.departmentsData = response?.data ? response.data : [];
      this.departments = response?.data
        .filter((d) => d.isActive === true)
        .map((d1) => ({
          id: d1._id,
          label: d1.name,
        }));
      this.filteredPrimaryDepartments = this.departments;
    },
    removeEmpty(obj) {
      let newObj = {};
      if (Array.isArray(obj)) {
        return obj;
      }
      Object.keys(obj).forEach((key) => {
        if (obj[key] === Object(obj[key]))
          newObj[key] = this.removeEmpty(obj[key]);
        else if (obj[key] !== undefined) newObj[key] = obj[key];
      });
      return newObj;
    },
    async getAllUsers() {
      this.users = [];
      const response = await usersService.fetchUsers();
      response.data.forEach((user) => {
        if (
          this.userId !== user._id &&
          user.userType != "user" &&
          user.isActive
        ) {
          this.users.push({
            id: user._id,
            label: user.firstName + " " + user.lastName,
          });
        }
      });
      this.filteredUsers = this.users;
    },
    async getAllDesignation() {
      const res = await fetchAllDesignation();
      this.filterDesignationOptions = res?.data;
    },
    onImageChange(file) {
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
        this.user.profileImageURL = croppedCanvas.toDataURL("image/png");
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
  props: ["layout", "userId"],
};
</script>

<style scoped>
.q-item,
.capital .q-field__native {
  text-transform: capitalize;
}
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}
.image-cropper {
  width: 800px;
  height: 500px;
}
.popup-width {
  width: 300px;
}
.text-align-right {
  text-align: right;
}
</style>
