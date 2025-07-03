<template>
  <div id="IRPage">
    <q-splitter
      v-model="splitterModel"
      class="window-height appraisal_tab_width ir_tab_width"
      style="margin-left: -20px; height: 88vh !important"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="timesheet_tabs text-primary gen_tabs q-pt-xl custom-padding"
        >
          <q-list bordered class="menu-grouping-list rounded-borders">
            <q-expansion-item expand-separator label="Self">
              <q-tab
                name="requestUser"
                icon="person_outline"
                label="Pending Requests"
                @click="loadRequestsByUser()"
              >
              </q-tab>
              <q-tab
                style="font-size: 12px !important"
                name="approvedUser"
                icon="person_outline"
                class="big_Text"
                label=""
                @click="loadApprovalsByUser()"
                >Approved <br />Reimbursement</q-tab
              >
            </q-expansion-item>
            <q-expansion-item
              expand-separator
              label="Admin"
              v-if="$store.getters.userType == 'admin'"
            >
              <q-tab
                v-if="userType === 'admin'"
                name="adminRequestUser"
                icon="person_outline"
                label="Pending Requests"
                @click="loadAllRequests()"
              />
              <q-tab
                v-if="userType === 'admin'"
                style="font-size: 12px !important"
                name="adminApprovedUser"
                icon="person_outline"
                label=""
                @click="loadAllApprovals()"
                class="big_Text"
                >Approved <br />Reimbursement</q-tab
              >
            </q-expansion-item>
          </q-list>
        </q-tabs>
      </template>
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          v-touch-swipe="handler"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="requestUser">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-btn
                flat
                label="Apply Reimbursement"
                color="primary"
                class="q-ml-auto"
                @click="showApplyIR"
                data-id="selfpendingir-applyirbutton"
              />
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="dateFilterAdminModel"
                class="q-px-sm col-4"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="dateFilterAdmin = null"
                data-id="selfpendingir-searchbymonth"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilterAdmin"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="selfpendingirsearchbymonth-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="selfpendingirsearchbymonthcalender-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>

              <div class="q-ml-auto text-primary">
                <q-toggle
                  v-model="showRejectedReqUser"
                  :class="showRejectedReqUser ? 'text-green' : 'text-red'"
                  data-id="selfpendingir-showrejectrequesttoggle"
                />
                <span
                  style="
                    padding-top: 0.7%;
                    font-weight: 500;
                    text-transform: uppercase;
                  "
                >
                  Show Rejected Requests
                </span>
              </div>
            </div>

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              @scroll="scrolled('MineLeaves')"
              id="MineLeaves"
            >
              <q-card
                v-for="(item, index) in irRequests"
                class="leave-card bg-white text-secondary q-ma-sm"
                style="width: 200px; min-height: 180px; padding: 5px"
                :class="
                  item?.status?.approved
                    ? 'border-primary'
                    : item?.status?.pending
                    ? 'border-warning'
                    : 'border-danger'
                "
              >
                <div class="q-pt-xs">
                  <div class="text-subtitle2 text-center">
                    {{
                      (item?.userId?.firstName !== undefined
                        ? item.userId.firstName
                        : "") +
                      " " +
                      (item?.userId?.lastName !== undefined
                        ? item.userId.lastName
                        : "")
                    }}
                  </div>
                  <div class="fs--10 text-center">
                    <span>{{
                      item?.selectedMonths !== undefined
                        ? item?.selectedMonths[0] +
                          " - " +
                          item.selectedMonths[item.selectedMonths.length - 1]
                        : "Undefined"
                    }}</span>
                    <div class="q-px-md fs--10 text-center q-pt-sm">
                      <b class="">Applied On: </b>
                      <span>{{ convertDate(item?.requestedDate) }}</span>
                      <div v-if="item.status.approved ? true : false">
                        <b class="">Approved Amount: </b>
                        <span>{{ item?.approvedAmount }}</span>
                      </div>
                      <q-separator light inset />
                      <b class="">Reim Amount: </b>
                      <span>{{ item?.reimAmount }}</span>
                      <div v-if="item.status.rejected ? true : false">
                        <b class="">Comments: </b>
                        <span style="cursor: pointer"
                          >{{ (item?.comments).substring(0, 15) }}
                          <q-tooltip
                            v-if="item?.comments.length > 15"
                            anchor="top middle"
                            self="bottom middle"
                            class="bg-tip shadow-1"
                            :offset="[10, 10]"
                          >
                            {{ item?.comments }}
                          </q-tooltip>
                        </span>
                      </div>
                      <div v-if="item.status.rejected ? true : false">
                        <b class="">Approved Amount: </b>
                        <span>{{ item?.approvedAmount }}</span>
                      </div>

                      <q-separator light inset />
                      <q-btn
                        flat
                        class="fs--10 q-mb-sm card-bottom"
                        :color="
                          item?.status.approved
                            ? 'primary'
                            : item.status.pending
                            ? 'warning'
                            : item.status.rejected
                            ? 'negative'
                            : 'white'
                        "
                        data-id="selfpendingir-viewdetailsbutton"
                        @click="
                          showViewDetails({
                            requestId: item._id,
                            callingFrom: 'requestUser',
                          })
                        "
                      >
                        View Details
                      </q-btn>
                    </div>
                  </div>
                </div>
              </q-card>
              <ViewDetails
                :IrTabName="'requestUser'"
                v-if="viewDetailsUserRequest"
                :viewModal="viewDetailsUserRequest"
                :inputData="selectedDocument"
                @closeModal="closeViewDetails()"
              />
              <ApplyIR
                v-if="afterMeIr"
                :viewModal="visibilityApplyIR"
                :serverDate="serverDate"
                :monthsToDisable="previouslyRequestedMonths"
                @closeModal="closeApplyIR"
              />
            </div>
          </q-tab-panel>
          <!-- -------------------------------------------------------------------------------------------- -->
          <!-- -------------------------------------------------------------------------------------------- -->
          <!-- -------------------------------------------------------------------------------------------- -->
          <!-- -------------------------------------------------------------------------------------------- -->
          <!-- -------------------------------------------------------------------------------------------- -->
          <q-tab-panel name="approvedUser" style="padding-top: 5%">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="dateFilterAdminModel"
                class="q-px-sm col-4"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="dateFilterAdmin = null"
                data-id="selfapprovedir-searchbymonth"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >

                  <q-date
                    v-model="dateFilterAdmin"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="selfapprovedirsearchbymonth-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="selfapprovedirsearchbymonthcalender-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>

            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
              >
                SETTLED
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
              >
                TO BE SETTLED
              </div>
            </div>

            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  @scroll="scrolled('IROwnSettled')"
                  id="IROwnSettled"
                >
                  <q-card
                    v-for="(item, index) in settledOwnIR"
                    class="leave-card bg-white text-secondary q-ma-sm"
                    style="width: 200px; min-height: 180px; padding: 5px"
                    :class="
                      item?.status?.approved ? 'border-primary' : 'border-gray'
                    "
                  >
                    <div class="q-pt-xs">
                      <div class="text-subtitle2 text-center">
                        {{
                          (item?.userId?.firstName !== undefined
                            ? item.userId.firstName
                            : "") +
                          " " +
                          (item?.userId?.lastName !== undefined
                            ? item.userId.lastName
                            : "")
                        }}
                      </div>
                      <div class="fs--10 text-center">
                        <span>{{
                          item.selectedMonths !== undefined
                            ? item.selectedMonths[0] +
                              " - " +
                              item.selectedMonths[
                                item.selectedMonths.length - 1
                              ]
                            : "Undefined"
                        }}</span>
                        <div class="q-px-md fs--10 text-center q-pt-sm">
                          <b class="">Applied On: </b>
                          <span>{{ convertDate(item?.requestedDate) }}</span>
                          <div>
                            <b class="">Approved For: </b>
                            <span>{{ item?.approvedMonth }}</span>
                          </div>
                          <q-separator light inset />
                          <b class="">Reim Amount: </b>
                          <span>{{ item?.reimAmount }}</span>
                          <div>
                            <b class="">Approved Amount: </b>
                            <span>{{ item?.approvedAmount }}</span>
                          </div>
                          <div v-if="item?.status.approved ? true : false">
                            <b class="">Monthly Reim Amount: </b>
                            <span>{{
                              (item?.monthlyReimAmount + "").substring(0, 5)
                            }}</span>
                          </div>
                          <q-separator light inset />
                          <q-btn
                            flat
                            class="fs--10 q-mb-sm card-bottom"
                            data-id="approvedirsettledcards-viewdetailsbutton"
                            :color="'primary'"
                            @click="
                              showViewDetails({
                                requestId: item._id,
                                callingFrom: 'approvedUser',
                              })
                            "
                          >
                            View Details
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  @scroll="scrolled('IROwnUnsettled')"
                  id="IROwnUnsettled"
                >
                  <q-card
                    v-for="(item, index) in unsettledOwnIR"
                    class="leave-card bg-white text-secondary q-ma-sm"
                    style="width: 200px; min-height: 180px; padding: 5px"
                    :class="'border-primary'"
                  >
                    <div class="q-pt-xs">
                      <div class="text-subtitle2 text-center">
                        {{
                          (item?.userId?.firstName !== undefined
                            ? item.userId.firstName
                            : "") +
                          " " +
                          (item?.userId?.lastName !== undefined
                            ? item.userId.lastName
                            : "")
                        }}
                      </div>
                      <div class="fs--10 text-center">
                        <span>{{
                          item.selectedMonths !== undefined
                            ? item.selectedMonths[0] +
                              " - " +
                              item.selectedMonths[
                                item.selectedMonths.length - 1
                              ]
                            : "Undefined"
                        }}</span>
                        <div class="q-px-md fs--10 text-center q-pt-sm">
                          <b class="">Applied On: </b>
                          <span>{{ convertDate(item?.requestedDate) }}</span>
                          <div>
                            <b class="">Approved For: </b>
                            <span>{{ item?.approvedMonth }}</span>
                          </div>
                          <q-separator light inset />
                          <b class="">Reim Amount: </b>
                          <span>{{ item?.reimAmount }}</span>
                          <div>
                            <b class="">Approved Amount: </b>
                            <span>{{ item?.approvedAmount }}</span>
                          </div>
                          <div>
                            <b class="">Monthly Reim Amount: </b>
                            <span>{{
                              (item?.monthlyReimAmount + "").substring(0, 5)
                            }}</span>
                          </div>
                          <!-- <div>
                        <b class="">Settlement Status: </b>
                        <span>{{ item?.settlementStatus ? 'Settled' : 'UnSettled' }}</span>
                      </div> -->
                          <q-separator light inset />
                          <q-btn
                            flat
                            class="fs--10 q-mb-sm card-bottom"
                            :color="'primary'"
                            @click="
                              showViewDetails({
                                requestId: item._id,
                                callingFrom: 'approvedUser',
                              })
                            "
                            data-id="approvedirtobesettledcards-viewdetailsbutton"
                          >
                            View Details
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </template>
            </q-splitter>

            <ViewDetails
              :IrTabName="'approvedUser'"
              v-if="viewDetailsUserApproved"
              :viewModal="viewDetailsUserApproved"
              :inputData="selectedDocument"
              @closeModal="closeViewDetails()"
            />
          </q-tab-panel>
          <q-tab-panel name="adminRequestUser" style="padding-top: 5%">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilterAllIr"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="getAdminIrByFilter"
                @keydown.enter="getAdminIrByFilter"
                dense
                data-id="adminpendingir-searchbyname"
                ><template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-input
                outlined
                v-model="dateFilterAdminModel"
                class="q-px-sm col-4"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="dateFilterAdmin = null"
                data-id="adminpendingir-searchbymonth"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilterAdmin"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="adminpendingirsearchbymonth-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="adminpendingirsearchbymonthcalender-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>

              <div class="q-ml-auto text-primary">
                <q-toggle
                  v-model="showRejectedReqAdmin"
                  :class="showRejectedReqAdmin ? 'text-green' : 'text-red'"
                  data-id="adminpendingir-showrejectrequesttoggle"
                />
                <span
                  style="
                    padding-top: 0.7%;
                    font-weight: 500;
                    text-transform: uppercase;
                  "
                >
                  Show Rejected Requests
                </span>
              </div>
            </div>

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              @scroll="scrolled('MineLeaves')"
              id="MineLeaves"
            >
              <q-card
                v-for="(item, index) in irRequestsAdmin"
                class="leave-card bg-white text-secondary q-ma-sm"
                style="width: 200px; min-height: 180px; padding: 5px"
                :class="
                  item.status.approved
                    ? 'border-primary'
                    : item.status.pending
                    ? 'border-warning'
                    : 'border-danger'
                "
              >
                <div class="q-pt-xs">
                  <div class="text-subtitle2 text-center">
                    {{
                      (item?.userId?.firstName !== undefined
                        ? item.userId.firstName
                        : "") +
                      " " +
                      (item?.userId?.lastName !== undefined
                        ? item.userId.lastName
                        : "")
                    }}
                  </div>
                  <div class="fs--10 text-center">
                    <span>{{
                      item.selectedMonths !== undefined
                        ? item.selectedMonths[0] +
                          " - " +
                          item.selectedMonths[item.selectedMonths.length - 1]
                        : "Undefined"
                    }}</span>
                    <div class="q-px-md fs--10 text-center q-pt-sm">
                      <b class="">Applied On: </b>
                      <span>{{ convertDate(item?.requestedDate) }}</span>
                      <div v-if="item.status.approved ? true : false">
                        <b class="">Approved Amount: </b>
                        <span>{{ item?.approvedAmount }}</span>
                      </div>
                      <q-separator light inset />
                      <b class="">Reim Amount: </b>
                      <span>{{ item?.reimAmount }}</span>
                      <div v-if="item.status.rejected ? true : false">
                        <b class="">Comments: </b>
                        <span style="cursor: pointer"
                          >{{ (item?.comments).substring(0, 35) }}
                          <q-tooltip
                            v-if="item?.comments.length > 35"
                            anchor="center right"
                            self="center left"
                            style="width: 50%"
                            class="bg-tip bg-tip-full-width-announce shadow-1"
                            :offset="[10, 10]"
                          >
                            {{ item?.comments }}
                          </q-tooltip>
                        </span>
                      </div>
                      <div v-if="item?.status.approved ? true : false">
                        <b class="">Approved Amount: </b>
                        <span>{{ item?.approvedAmount }}</span>
                      </div>

                      <q-separator light inset />
                    </div>
                  </div>
                </div>
                <div>
                  <q-card-actions class="justify-center card-bottom">
                    <q-btn
                      v-if="item.status.pending"
                      icon-right="o_check"
                      color="primary"
                      class="fs--10"
                      flat
                      @click="onApproveClick(item._id, true)"
                      data-id="adminpendingir-approvebutton"
                      :disable="item?.userId._id == $store.getters.userId"
                    ></q-btn>
                    <q-btn
                      v-if="item.status.pending"
                      icon-right="o_cancel"
                      color="negative"
                      class="fs--10"
                      flat
                      @click="rejectDialog(item._id)"
                      data-id="adminpendingir-rejectbutton"
                      :disable="item?.userId._id == $store.getters.userId"
                    ></q-btn>
                    <q-btn
                      flat
                      v-if="item.status.pending"
                      class="fs--10"
                      :color="'warning'"
                      @click="onAdminViewIRRequest(item._id)"
                      data-id="adminpendingir-viewdetailsbutton"
                    >
                      View Details
                    </q-btn>
                    <q-btn
                      flat
                      v-if="!item.status.pending"
                      class="fs--10"
                      :color="
                        item.status.approved
                          ? 'primary'
                          : item.status.pending
                          ? 'warning'
                          : item.status.rejected
                          ? 'negative'
                          : 'white'
                      "
                      @click="
                        showViewDetails({
                          requestId: item._id,
                          callingFrom: 'requestAdmin',
                        })
                      "
                      data-id="rejectir-viewdetailsbutton"
                    >
                      View Details
                    </q-btn>
                  </q-card-actions>
                </div>
              </q-card>
              <q-dialog v-model="showRejectionDialog">
                <q-card style="min-width: 350px">
                  <q-form @submit="oCancelClick">
                    <q-card-section>
                      <div class="text-h6">Comments</div>
                      <div class="text-h10 text-negative">
                        *Required in case of request rejection.
                      </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <q-input
                        v-model="comments"
                        outlined
                        dense
                        lazy-rules
                        style="max-width: 350px"
                        class="q-ml-auto"
                        type="text"
                        :rules="[
                          (bill) =>
                            (bill && bill.length > 0 && !!bill.trim()) ||
                            ' * Comments Required',
                        ]"
                      />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                      <q-btn
                        flat
                        label="Cancel"
                        @click="onCloseReject"
                        data-id="ircomment-cancelbutton"
                      />
                      <q-btn
                        flat
                        type="submit"
                        label="Ok"
                        data-id="ircomment-okbutton"
                      />
                    </q-card-actions>
                  </q-form>
                </q-card>
              </q-dialog>
              <ViewRequest
                v-if="viewAdminRequestModal"
                :viewModal="viewAdminRequestModal"
                :inputData="selectedDocument"
                @onApproveClick="onApproveClick"
                @closeModal="closeViewRequest"
              />
              <ViewDetails
                :IrTabName="'adminRequestUser'"
                v-if="viewDetailsAdminRequest"
                :viewModal="viewDetailsAdminRequest"
                :inputData="selectedDocument"
                @closeModal="closeViewDetails()"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="adminApprovedUser" style="padding-top: 5%">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilterAllIr"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="getAdminIrByFilter"
                @keydown.enter="getAdminIrByFilter"
                dense
                data-id="adminapprovedir-searchbyname"
                ><template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                v-model="dateFilterAdminModel"
                class="q-px-sm col-4"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="dateFilterAdmin = null"
                data-id="adminapprovedir-searchbymonth"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilterAdmin"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="adminapprovedirsearchbymonth-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="adminapprovedirsearchbymonthcalender-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>

            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
              >
                SETTLED
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
              >
                TO BE SETTLED
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  @scroll="scrolled('IRSettled')"
                  id="IRSettled"
                >
                  <q-card
                    v-for="(item, index) in settledIR"
                    class="leave-card bg-white text-secondary q-ma-sm approved-card"
                    :class="
                      item?.status?.approved ? 'border-primary' : 'border-gray'
                    "
                  >
                    <div class="q-pt-xs">
                      <div class="text-subtitle2 text-center">
                        {{
                          (item?.userId?.firstName !== undefined
                            ? item.userId.firstName
                            : "") +
                          " " +
                          (item?.userId?.lastName !== undefined
                            ? item.userId.lastName
                            : "")
                        }}
                      </div>
                      <div class="fs--10 text-center">
                        <span>{{
                          item.selectedMonths !== undefined
                            ? item.selectedMonths[0] +
                              " - " +
                              item.selectedMonths[
                                item.selectedMonths.length - 1
                              ]
                            : "Undefined"
                        }}</span>
                        <div class="payroll-month-style">
                          <b>Payroll Month: </b> {{ item?.payrollMonth }}
                        </div>
                        <div class="q-px-md fs--10 text-center q-pt-sm">
                          <b class="">Applied On: </b>
                          <span>{{ convertDate(item?.requestedDate) }}</span>
                          <div>
                            <b class="">Approved For: </b>
                            <span>{{ item?.approvedMonth }}</span>
                          </div>
                          <q-separator light inset />
                          <b class="">Reim Amount: </b>
                          <span>{{ item?.reimAmount }}</span>
                          <div>
                            <b class="">Approved Amount: </b>
                            <span>{{ item?.approvedAmount }}</span>
                          </div>
                          <div>
                            <b class="">Monthly Reim Amount: </b>
                            <span>{{
                              (item?.monthlyReimAmount + "").substring(0, 5)
                            }}</span>
                          </div>

                          <q-separator light inset />
                          <q-card-actions class="justify-center card-bottom">
                            <q-btn
                              v-if="!item.settlementStatus"
                              flat
                              class="fs--10"
                              :color="'primary'"
                              @click="
                                showViewDetails({
                                  requestId: item._id,
                                  callingFrom: 'approvedAdmin',
                                })
                              "
                            >
                              View Details
                            </q-btn>
                          </q-card-actions>
                          <q-btn
                            v-if="item.settlementStatus"
                            flat
                            class="fs--10 q-mb-sm"
                            :color="'primary card-bottom'"
                            @click="
                              showViewDetails({
                                requestId: item._id,
                                callingFrom: 'approvedAdmin',
                              })
                            "
                            data-id="adminapprovedirsettledcard-viewdetailsbutton"
                          >
                            View Details
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  @scroll="scrolled('IRUnsettled')"
                  id="IRUnsettled"
                >
                  <q-card
                    v-for="(item, index) in unsettledIR"
                    class="leave-card bg-white text-secondary q-ma-sm approved-card"
                    :class="
                      item?.isPaid ? 'border-secondary' : 'border-primary'
                    "
                  >
                    <div class="q-pt-xs">
                      <div class="text-subtitle2 text-center">
                        {{
                          (item?.userId?.firstName !== undefined
                            ? item.userId.firstName
                            : "") +
                          " " +
                          (item?.userId?.lastName !== undefined
                            ? item.userId.lastName
                            : "")
                        }}
                      </div>
                      <div class="fs--10 text-center">
                        <span>{{
                          item.selectedMonths !== undefined
                            ? item.selectedMonths[0] +
                              " - " +
                              item.selectedMonths[
                                item.selectedMonths.length - 1
                              ]
                            : "Undefined"
                        }}</span>
                        <div class="payroll-month-style">
                          <b>Payroll Month: </b>
                          {{ getPayrollMonth(item?.payrollMonth) }}
                        </div>
                        <div class="q-px-md fs--10 text-center q-pt-sm">
                          <b class="">Applied On: </b>
                          <span>{{ convertDate(item?.requestedDate) }}</span>
                          <div>
                            <b class="">Approved For: </b>
                            <span>{{ item?.approvedMonth }}</span>
                          </div>
                          <q-separator light inset />
                          <b class="">Reim Amount: </b>
                          <span>{{ item?.reimAmount }}</span>
                          <div>
                            <b class="">Approved Amount: </b>
                            <span>{{ item?.approvedAmount }}</span>
                          </div>
                          <div>
                            <b class="">Monthly Reim Amount: </b>
                            <span>{{
                              (item?.monthlyReimAmount + "").substring(0, 5)
                            }}</span>
                          </div>
                          <q-separator light inset />
                          <q-card-actions class="justify-center card-bottom">
                            <q-btn
                              v-if="!item.isPaid"
                              icon="event"
                              color="primary"
                              class="fs--10"
                              flat
                              @click="onChangePayrollMonth(item._id)"
                              data-id="adminapprovedirtobesettledcard-calenderbutton"
                            >
                              <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="bg-tip shadow-1"
                                :offset="[10, 10]"
                              >
                                Change Payroll Month
                              </q-tooltip>
                            </q-btn>
                            <q-btn
                              v-if="!item.settlementStatus"
                              flat
                              class="fs--10"
                              :color="'primary'"
                              @click="
                                showViewDetails({
                                  requestId: item._id,
                                  callingFrom: 'approvedAdmin',
                                })
                              "
                              data-id="adminapprovedirtobesettledcard-viewdetailsbutton"
                            >
                              View Details
                            </q-btn>
                          </q-card-actions>
                          <q-btn
                            v-if="item.settlementStatus"
                            flat
                            class="fs--10 q-mb-sm"
                            :color="'primary card-bottom'"
                            @click="
                              showViewDetails({
                                requestId: item._id,
                                callingFrom: 'approvedAdmin',
                              })
                            "
                          >
                            View Details
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </template>
            </q-splitter>
            <ViewDetails
              :IrTabName="'AdminApprovedUser'"
              v-if="viewDetailsAdminApprove"
              :viewModal="viewDetailsAdminApprove"
              :inputData="selectedDocument"
              @closeModal="closeViewDetails()"
            />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
  <DialogForIRApproval
    v-if="openAdjustPayrollMonthDialog"
    :minPayrollMonth="minPayrollMonth"
    :payrollSelector="payrollMonth"
    :payrollMonthDialog="openAdjustPayrollMonthDialog"
    @showConfirmation="showConfirmation"
    @closeModel="closePayrollModel"
  >
  </DialogForIRApproval>
  <q-dialog
    v-model="errorLayout"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-negative text-white login-error">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning" class="text-white" style="font-size: 2rem" />
          Error
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none" v-html="errorMessage"> </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat color="negative" label="OK" @click="errorLayout = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import ApplyIR from "../components/InternetReimbursement/ApplyIR.vue";
import CheckboxCalendar from "../components/InternetReimbursement/CheckboxCalendar.vue";
import DialogForIRApproval from "../components/InternetReimbursement/DialogForIRApproval.vue";
import ViewDetails from "../components/InternetReimbursement/ViewDetails.vue";
import ViewRequest from "../components/InternetReimbursement/ViewRequest.vue";
import Notify from "../components/Notify.vue";
import * as irServices from "../services/IR.service";
import { getLastLockedPayrollDetails } from "../services/IRHelperService";
import * as functions from "../services/functions";
import * as timesheetsService from "../services/timesheets.service";

export default {
  components: {
    Notify,
    CheckboxCalendar,
    ApplyIR,
    ViewRequest,
    ViewDetails,
    DialogForIRApproval,
  },
  async mounted() {
    if (this.$store.getters.userType == "admin") {
      const payrollData = await getLastLockedPayrollDetails();
      this.lastLockedPayrollMonth = payrollData.lastLockedPayrollMonth;
      this.minPayrollMonth = payrollData.minPayrollMonth;
    }
    this.loadRequestsByUser();
  },
  data() {
    return {
      showRejectedReqUser: false,
      showRejectedReqAdmin: false,
      step: 1,
      splitterModelMyLeaves: 50,
      checked: false,
      comments: "",
      selectedDocument: {},
      denoteColors: [
        {
          text: "Approved",
          color: "#93BE3B ",
        },
        {
          text: "Approval Pending",
          color: "#F2C037 ",
        },
        {
          text: "Rejected",
          color: "#C10015 ",
        },
      ],
      denoteColors2: [
        {
          text: "Settled",
          color: "#93BE3B ",
        },
        {
          text: "To be Settled",
          color: "#F2C037 ",
        },
      ],
      tab: "requestUser",
      checkedMonths: [],
      irRequests: [],
      irRequestsAdmin: [],
      notSettledData: [],
      requestIds: [],
      irApproved: [],
      irApprovedAdmin: [],
      visibilityApplyIR: false,
      viewDetailsAdminRequest: false,
      viewDetailsAdminApprove: false,
      viewDetailsUserRequest: false,
      viewDetailsUserApproved: false,
      userType: this.$store.getters.userType,
      viewAdminRequestModal: false,
      nameFilterAllIr: "",
      statusFilterAdminRequestUser: "",
      globalIndex: 0,
      serverDate: "",
      showRejectionDialog: false,
      selectedRequestId: "",
      previouslyApprovedMonths: [],
      previouslyRequestedMonths: [],
      afterMeIr: false,
      selectAll: false,
      unsettledIR: [],
      settledIR: [],
      unsettledOwnIR: [],
      settledOwnIR: [],
      dateFilterAdmin: null,
      successMsg: "",
      errorLayout: false,
      errorMessage: "",
      lastLockedPayrollMonth: null,
      payrollMonth: null,
      openAdjustPayrollMonthDialog: false,
      IRRequestData: null,
      minPayrollMonth: null,
      approveRequestId: null,
    };
  },
  async beforeMount() {
    this.$store.commit("changeTabName", "Pending Requests");
    const res = await timesheetsService.getServerDate();
    this.serverDate = new Date(res.data);
  },
  created() {},
  watch: {
    showRejectedReqUser: async function () {
      await this.loadRequestsByUser();
      if (this.showRejectedReqUser) {
        await this.loadRejectedRequestsByUser();
      }
    },
    showRejectedReqAdmin: async function () {
      await this.loadAllRequests();
      if (this.showRejectedReqAdmin) {
        await this.loadAllRejectedRequests();
      }
    },
    visibilityApplyIR(newVal) {
      this.visibilityApplyIR = newVal;
    },
    serverDate(newDate) {
      this.serverDate = newDate;
    },
    selectedRequestId(newVal) {
      this.selectedRequestId = newVal;
    },
    previouslyApprovedMonths() {},
    previouslyRequestedMonths(val) {
      this.previouslyRequestedMonths = val;
    },
    step: function (val) {
      if (val == 1) {
        this.tab = "requestUser";
        this.loadRequestsByUser();
      } else if (val == 2) {
        this.tab = "adminRequestUser";
        this.loadAllRequests();
      }
    },
    tab: function (val) {
      this.skip = 0;
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.showRejectedReqUser = false;
      this.showRejectedReqAdmin = false;
    },
    dateFilterAdmin: function (newVal) {
      this.getAdminIrByFilter();
    },
    statusFilterAdminRequestUser: function (newVal) {
      if (newVal) {
        this.getAdminIrByFilter();
      }
    },
  },
  computed: {
    dateFilterAdminModel: {
      get() {
        if (this.dateFilterAdmin) {
          return this.dateFilterAdmin;
        } else {
          return "";
        }
      },
    },
    checkEmpty() {
      return this.unsettledIR.length == 0;
    },
  },
  methods: {
    clearSuccessMsg() {
      this.successMsg = "";
    },
    onCloseReject() {
      this.comments = "";
      this.showRejectionDialog = false;
    },
    scrolled(val) {
      var elmnt = document.getElementById(val);
      this.divScrollerTop = parseFloat(elmnt.scrollTop).toFixed();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    getAdminIrByFilter() {
      this.$q.loading.show();
      this.skip = 0;
      this.irRequests = [];
      this.irApproved = [];
      this.irRequestsAdmin = [];
      this.irApprovedAdmin = [];

      if (
        !this.nameFilterAllIr &&
        this.dateFilterAdmin == null &&
        this.tab == "adminApprovedUser"
      ) {
        this.loadAllApprovals();
      } else if (this.dateFilterAdmin == null && this.tab == "approvedUser") {
        this.loadApprovalsByUser();
      } else if (this.dateFilterAdmin == null && this.tab == "requestUser") {
        if (this.showRejectedReqUser) {
          this.loadRejectedRequestsByUser();
        } else {
          this.loadRequestsByUser();
        }
      } else if (
        !this.nameFilterAllIr &&
        this.dateFilterAdmin == null &&
        this.tab == "adminRequestUser"
      ) {
        if (this.showRejectedReqAdmin) {
          this.loadAllRejectedRequests();
        } else {
          this.loadAllRequests();
        }
      } else {
        this.apiForAllSheetFilter();
      }
    },
    async apiForAllSheetFilter() {
      var res = [];
      let fromMonth = "";
      if (this.dateFilterAdmin) {
        fromMonth = this.dateFilterAdmin;
      }

      if (this.tab == "adminApprovedUser") {
        res = await irServices.fetchAllIrByFilter({
          name: this.nameFilterAllIr ? this.nameFilterAllIr : "",
          fromMonth: fromMonth ? fromMonth : "",
        });

        this.irApprovedAdmin = res.data;
        this.settledIR = this.irApprovedAdmin
          .filter((ir) => ir.settlementStatus)
          .sort(
            (a, b) =>
              new Date(b.approvedMonthDate) - new Date(a.approvedMonthDate),
          );
        this.unsettledIR = this.irApprovedAdmin
          .filter((ir) => !ir.settlementStatus)
          .sort(
            (a, b) =>
              new Date(a.approvedMonthDate) - new Date(b.approvedMonthDate),
          );
      } else if (this.tab === "adminRequestUser") {
        let status = "Pending";
        if (this.showRejectedReqAdmin) {
          status = "Rejected";
        }

        res = await irServices.fetchAllUserRequestViaAdminByFilter({
          name: this.nameFilterAllIr,
          fromMonth: fromMonth ? fromMonth : "",
          status: status,
        });
        this.irRequestsAdmin = res.data;
      } else if (this.tab == "approvedUser") {
        res = await irServices.fetchAllApprovedIrByUserIdFilter({
          userId: this.$store.getters.userId,
          fromMonth: fromMonth ? fromMonth : "",
        });

        this.irApproved = res.data;
        this.settledOwnIR = this.irApproved
          .filter((ir) => ir.settlementStatus)
          .sort(
            (a, b) =>
              new Date(b.approvedMonthDate) - new Date(a.approvedMonthDate),
          );
        this.unsettledOwnIR = this.irApproved
          .filter((ir) => !ir.settlementStatus)
          .sort(
            (a, b) =>
              new Date(a.approvedMonthDate) - new Date(b.approvedMonthDate),
          );
      } else if (this.tab === "requestUser") {
        let status = "Pending";
        if (this.showRejectedReqUser) {
          status = "Rejected";
        }
        res = await irServices.fetchAllUserRequestViaUserIdByFilter({
          userId: this.$store.getters.userId,
          fromMonth: fromMonth ? fromMonth : "",
          status: status,
        });
        this.irRequests = res.data;
      }
      this.$q.loading.hide();
    },
    async getProperMonth(tempMonth, tempYear) {
      switch (tempMonth) {
        case "01":
          return "Jan " + tempYear;
          break;
        case "02":
          return "Feb " + tempYear;
          break;
        case "03":
          return "Mar " + tempYear;
          break;
        case "04":
          return "Apr " + tempYear;
          break;
        case "05":
          return "May " + tempYear;
          break;
        case "06":
          return "Jun " + tempYear;
          break;
        case "07":
          return "Jul " + tempYear;
          break;
        case "08":
          return "Aug " + tempYear;
          break;
        case "09":
          return "Sep " + tempYear;
          break;
        case "10":
          return "Oct " + tempYear;
          break;
        case "11":
          return "No " + tempYear;
          break;
        case "12":
          return "Dec " + tempYear;
          break;
      }
    },
    async loadRejectedRequestsByUser() {
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices
        .getRejectedRequestsByUserId(this.$store.getters.userId)
        .then((response) => {
          if (!response.data.requestStatus) {
            this.irRequests = response.data;
          } else {
            this.irRequests = [];
          }
        });
      this.afterMeIr = true;
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Rejected Requests");
      this.viewDetailsUserRequest = false;
      this.selectedDocument = "";
    },
    async loadRequestsByUser() {
      await irServices
        .getRequestedMonths(this.$store.getters.userId)
        .then((response) => {
          if (!response.data.requestStatus) {
            this.previouslyRequestedMonths = response.data.selectedMonths;
          } else {
            this.previouslyRequestedMonths = [];
            console.log(
              "In load requested months No data found for this user Id, no IR request yet.",
            );
          }
        });

      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices
        .getRequestsByUserId(this.$store.getters.userId)
        .then((response) => {
          if (!response.data.requestStatus) {
            this.irRequests = response.data;
          } else {
            console.log("No data found for this user Id, no IR request yet.");
            this.irRequests = [];
          }
        });

      await irServices
        .getApprovedMonths(this.$store.getters.userId)
        .then((response) => {
          if (!response.data.requestStatus) {
            this.previouslyApprovedMonths = response.data.approvedMonths;
          } else {
            this.previouslyApprovedMonths = [];
            console.log(
              "In loadapproved months No data found for this user Id, no IR request yet.",
            );
          }
        });

      this.afterMeIr = true;
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Pending Requests");
      this.viewDetailsUserRequest = false;
      this.selectedDocument = "";
    },
    async loadApprovalsByUser() {
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices
        .getApprovedRequestsByUserId(this.$store.getters.userId)
        .then((response) => {
          if (!response.data.requestStatus) {
            this.irApproved = response.data;
            this.settledOwnIR = this.irApproved
              .filter((ir) => ir.settlementStatus)
              .sort(
                (a, b) =>
                  new Date(b.approvedMonthDate) - new Date(a.approvedMonthDate),
              );
            this.unsettledOwnIR = this.irApproved
              .filter((ir) => !ir.settlementStatus)
              .sort(
                (a, b) =>
                  new Date(a.approvedMonthDate) - new Date(b.approvedMonthDate),
              );
          } else {
            console.log("No data found for this user Id, no IR request yet.");
          }
        });
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Approved Reimbursement");
      this.viewDetailsUserApproved = false;
      this.selectedDocument = "";
    },
    async loadAllRequests() {
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices.getAllRequests().then((response) => {
        if (!response.data.requestStatus) {
          this.irRequestsAdmin = response.data;
        } else {
          this.irRequestsAdmin = [];
        }
      });
      const payrollData = await getLastLockedPayrollDetails();
      this.lastLockedPayrollMonth = payrollData.lastLockedPayrollMonth;
      this.minPayrollMonth = payrollData.minPayrollMonth;
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Pending Requests");
      this.viewDetailsAdminRequest = false;
      this.selectedDocument = "";
    },
    async loadAllRejectedRequests() {
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices.getAllRejectedRequests().then((response) => {
        if (!response.data.requestStatus) {
          this.irRequestsAdmin = response.data;
        } else {
          this.irRequestsAdmin = [];
        }
      });
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Rejected Requests");
      this.viewDetailsAdminRequest = false;
      this.selectedDocument = "";
    },
    async loadAllApprovals() {
      this.nameFilterAllIr = "";
      this.statusFilterAdminRequestUser = "";
      this.dateFilterAdmin = null;
      this.$q.loading.show();
      await irServices.getAllApprovedRequests().then((response) => {
        if (!response.data.requestStatus) {
          this.irApprovedAdmin = response.data;
          this.settledIR = this.irApprovedAdmin
            .filter((ir) => ir.settlementStatus)
            .sort(
              (a, b) =>
                new Date(b.approvedMonthDate) - new Date(a.approvedMonthDate),
            );
          this.unsettledIR = this.irApprovedAdmin
            .filter((ir) => !ir.settlementStatus)
            .sort(
              (a, b) =>
                new Date(a.approvedMonthDate) - new Date(b.approvedMonthDate),
            );
        }
      });
      this.$q.loading.hide();
      this.$store.commit("changeTabName", "Approved Reimbursement");
      this.viewDetailsAdminApprove = false;
      this.selectedDocument = "";
    },
    rejectDialog(requestId) {
      this.selectedRequestId = requestId;
      this.showRejectionDialog = true;
      this.getAdminIrByFilter();
    },
    async oCancelClick() {
      let submission = {
        requestId: this.selectedRequestId,
        status: {
          pending: "false",
          approved: "false",
          rejected: "true",
        },
        comments: this.comments,
      };
      await irServices.rejectRequest(submission).then((uploadResponse) => {
        if (uploadResponse.data.reqStatus === "error") {
        }
      });
      this.comments = "";
      this.showRejectionDialog = false;
      this.selectedRequestId = "";
      this.getAdminIrByFilter();
      this.onLoad();
    },
    async onApproveClick(data, cardClick) {
      this.IRRequestData = cardClick
        ? this.irRequestsAdmin.find((request) => request._id === data)
        : data;
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Would you like to approve the request?",
          cancel: true,
          ok: "Confirm",
          persistent: true,
        })
        .onOk(() => {
          this.onConfirmApprove();
        });
    },

    getPayrollMonth(payrollMonth) {
      const convertedDate = functions.getMonthStartAndEndDate(payrollMonth);
      const lastLockedPayrollMonthDate = functions.getMonthStartAndEndDate(
        this.lastLockedPayrollMonth,
      ).MonthStart;
      if (
        convertedDate &&
        convertedDate.MonthStart > lastLockedPayrollMonthDate
      )
        return payrollMonth;
      else return null;
    },

    async onChangePayrollMonth(id) {
      this.approveRequestId = id;
      this.openAdjustPayrollMonthDialog = true;
    },

    async showConfirmation(payrollMonth) {
      this.openAdjustPayrollMonthDialog = false;
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Would you like to change the payroll month?",
          cancel: true,
          ok: "Confirm",
          persistent: true,
        })
        .onOk(() => {
          this.changePayrollMonth(payrollMonth);
        });
    },

    async changePayrollMonth(payrollMonth) {
      const data = {
        requestId: this.approveRequestId,
        payrollMonth: payrollMonth,
      };
      this.$q.loading.show();
      await irServices
        .changePayrollMonth(data)
        .then((res) => {
          if (res.status == 200) this.successMsg = res.data.message;
          else {
            this.errorMessage = res.data.message;
            this.errorLayout = true;
          }
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = "Payroll month could not be changed!";
          this.errorLayout = true;
          this.$q.loading.hide();
        });
      this.$q.loading.hide();
      this.approveRequestId = null;
      this.loadAllApprovals();
    },

    async onConfirmApprove() {
      const submission = {
        requestId: this.IRRequestData._id,
        approvedAmount: this.IRRequestData.reimAmount,
        approvedMonths: this.IRRequestData.selectedMonths,
        approvalDate: Date.now(),
        status: {
          pending: "false",
          approved: "true",
          rejected: "false",
        },
        adjustedPayrollMonth: this.payrollMonth,
      };
      await irServices
        .approveRequest(submission)
        .then(() => {
          this.successMsg = "IR approved successfully!";
        })
        .catch((error) => {
          this.errorMessage = "IR could not be approved!";
          this.errorLayout = true;
        });
      this.onLoad();
      this.showRejectionDialog = false;
      this.getAdminIrByFilter();
    },

    closePayrollModel() {
      this.openAdjustPayrollMonthDialog = false;
    },

    async checkedUncheckedIrRequest(requestId) {
      if (this.selectAll === false && this.requestIds.length <= 0) {
        this.requestIds = [];
      }

      if (!this.requestIds.includes(requestId)) {
        this.requestIds.push(requestId);
      } else {
        var index = this.requestIds.findIndex((x) => x == requestId);
        this.requestIds.splice(index, 1);
      }
      if (this.requestIds.length !== this.unsettledIR.length) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    },

    async onLoad() {},
    setSelectedMonth(selectedMonths) {
      this.checkedMonths = selectedMonths;
    },
    showApplyIR() {
      this.getAdminIrByFilter();
      this.visibilityApplyIR = true;
    },
    async closeApplyIR() {
      this.visibilityApplyIR = false;
      this.getAdminIrByFilter();
    },
    onAdminViewIRRequest(requestId) {
      this.selectedDocument = this.irRequestsAdmin.find(
        (request) => request._id === requestId,
      );
      this.viewAdminRequestModal = true;
    },
    closeViewRequest() {
      this.getAdminIrByFilter();
      this.viewAdminRequestModal = false;
    },
    showViewDetails(inputParameter) {
      if (inputParameter.callingFrom === "requestAdmin") {
        this.selectedDocument = this.irRequestsAdmin.find(
          (request) => request._id === inputParameter.requestId,
        );
        this.viewDetailsAdminRequest = true;
      } else if (inputParameter.callingFrom === "approvedAdmin") {
        this.selectedDocument = this.irApprovedAdmin.find(
          (request) => request._id === inputParameter.requestId,
        );
        this.viewDetailsAdminApprove = true;
      } else if (inputParameter.callingFrom === "requestUser") {
        this.selectedDocument = this.irRequests.find(
          (request) => request._id === inputParameter.requestId,
        );
        this.viewDetailsUserRequest = true;
      } else if (inputParameter.callingFrom === "approvedUser") {
        this.selectedDocument = this.irApproved.find(
          (request) => request._id === inputParameter.requestId,
        );
        this.viewDetailsUserApproved = true;
      }
    },
    closeViewDetails() {
      this.viewDetailsAdminApprove = false;
      this.viewDetailsAdminRequest = false;
      this.viewDetailsUserApproved = false;
      this.viewDetailsUserRequest = false;
      this.selectedDocument = "";
      this.getAdminIrByFilter();
    },
    selectAllAndShowButton() {
      if (this.unsettledIR.length != 0) {
        this.selectAll = !this.selectAll;
        this.requestIds = [];
        if (this.selectAll == true) {
          this.checked = true;
          this.unsettledIR.forEach((request) => {
            request.settlementStatus = true;
            this.requestIds.push(request._id);
          });
        }
        if (this.selectAll == false) {
          this.checked = false;
          this.unsettledIR.forEach((request) => {
            request.settlementStatus = false;
          });
        }
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
};
</script>

<style scoped>
.big_Text {
  font-size: 14px;
}

.q-tab__content,
.q-tabs--vertical .q-tab {
  font-weight: 500 !important;
}
.appraisal_tab_width .q-splitter__panel.q-splitter__before {
  width: 50% !important;
}
.hide-separator {
  width: 0px !important;
}

.leave-separator {
  height: 60vh !important;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
.heightSet {
  height: 60vh !important;
}
</style>
<style>
.IrStepper .q-stepper__tab {
  padding: 12px 24px !important;
}

.settledButton {
  width: 100%;
  text-align: left;
}
.timesheet_tabs .q-tabs__arrow {
  display: none;
}
.timesheet_tabs .q-tabs__content {
  height: 80vh !important;
  overflow-y: auto;
}
.card-bottom {
  bottom: 5%;
  position: absolute;
  left: 0;
  right: 0;
}
.q-expansion-item .q-tab__label {
  font-size: 12px !important;
}
.payroll-month-style {
  margin-top: 8px;
  font-size: 11px;
}
.approved-card {
  width: 210px;
  min-height: 210px;
  padding: 5px;
}
</style>
