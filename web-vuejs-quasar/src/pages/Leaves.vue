<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="window-height appraisal_tab_width leave_tab_width"
      style="margin-left: -20px; height: 88vh !important"
    >
      <!-- left side tabs -->
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="timesheet_tabs text-primary gen_tabs q-pt-xl custom-padding"
        >
          <q-list bordered class="menu-grouping-list rounded-borders">
            <q-expansion-item
              expand-separator
              label="Self"
              data-id="leaves-self"
            >
              <q-tab
                name="Leave Requests"
                icon="task"
                label="Leave Requests"
                @click="routeToLoadLeaveRequests"
                data-id="leaverequest"
              />
              <q-tab
                name="Mine"
                icon="chalet"
                label="My Leaves"
                @click="routeToGetMyLeaves"
                data-id="leaves-myleaves"
              />
              <q-tab
                name="My Accruals"
                icon="beenhere"
                label="My Accruals"
                @click="routeToLoadToLeaveAccruals"
                data-id="myaccruals"
              />
              <q-tab
                name="My LWPs"
                icon="trending_down"
                label="My LWPs"
                @click="routeToLoadToMyLWPs"
                data-id="mylwp"
              />
              <q-tab
                name="LeaveEncashment"
                icon="savings"
                label="Leave Encashment"
                @click="routeToLoadMyEncashments"
                data-id="leaveencashment"
              />
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              label="Mentor/Manager"
              v-if="
                $store.getters.userType == 'mentor' ||
                $store.getters.userType == 'admin' ||
                $store.getters.userType == 'manager'
              "
              data-id="leaves-mentor-manager"
            >
              <q-tab
                name="Mentees Leave Requests"
                icon="task"
                label=""
                v-if="$store.getters.userType != 'user'"
                @click="routeToGetMyMenteesLeaveRequests"
                class="text-caption text-weight-medium"
                data-id="menteesleaverequest"
              >
                Mentees Leave <br />
                Requests</q-tab
              >
              <q-tab
                name="Managees Leave Requests"
                icon="task"
                label=""
                v-if="
                  $store.getters.userType == 'admin' ||
                  $store.getters.userType == 'manager'
                "
                @click="routeToGetMyManageesLeaveRequests"
                class="text-caption text-weight-medium"
                data-id="manageesleaverequest"
              >
                Managees Leave <br />Requests
              </q-tab>
              <q-tab
                name="My Mentees"
                icon="chalet"
                label="My Mentees"
                v-if="$store.getters.userType != 'user'"
                @click="routeToGetMyMentees"
                data-id="leaves-mymentees"
              />
              <q-tab
                name="My Managees"
                icon="chalet"
                label="My Managees"
                v-if="
                  $store.getters.userType == 'admin' ||
                  $store.getters.userType == 'manager'
                "
                @click="routeToGetMyManagees"
                data-id="leaves-mymanagees"
              />
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              label="Admin"
              v-if="$store.getters.userType == 'admin'"
              data-id="leaves-admin"
            >
              <q-tab
                name="AllLeaveRequests"
                icon="task"
                label="All Leave Request"
                @click="routeToLoadToAllLeaveRequest"
                v-if="$store.getters.userType == 'admin'"
                data-id="allleaverequest"
              />
              <q-tab
                name="AllLeaves"
                icon="chalet"
                label="All Leaves"
                v-if="$store.getters.userType == 'admin'"
                @click="routeToLoadAllLeaves"
                data-id="allleaves"
              />
              <q-tab
                name="All LWPs"
                icon="trending_down"
                label="All LWPs"
                v-if="$store.getters.userType == 'admin'"
                @click="routeToLoadAllLWPs"
                data-id="alllwps"
              />
              <q-tab
                name="All Accruals"
                icon="beenhere"
                label="All Accruals"
                @click="routeToLoadToAllAccruals"
                v-if="$store.getters.userType == 'admin'"
                data-id="allaccruals"
              />
              <q-tab
                name="UserLeaveBalance"
                icon="account_balance_wallet"
                label="Leave Balance"
                @click="routeToLoadToUsersLeaveBalance"
                v-if="$store.getters.userType == 'admin'"
                data-id="userleavebalance"
              />
              <q-tab
                @click="routeToGetShortfallSheet"
                name="shortfallSheet"
                icon="hourglass_top"
                label="Shortfall Sheets"
                v-if="$store.getters.userType == 'admin'"
                data-id="shortfallsheet"
              />
              <q-tab
                @click="routeToLoadcompoffTimeSheets"
                name="compoffSheets"
                icon="redeem"
                label="Compoff Sheets"
                v-if="$store.getters.userType == 'admin'"
                data-id="leaves-comoffsheets"
              />
              <q-tab
                name="AccruedConfigurations"
                icon="admin_panel_settings"
                label="Accrual Configurations"
                v-if="$store.getters.userType == 'admin'"
                @click="routeToLoadToAccruedConfigurations"
                data-id="accrualconfiguration"
              />
              <q-tab
                name="LeaveEncashmentAdmin"
                icon="credit_score"
                label="All Leave Encashment"
                v-if="$store.getters.userType == 'admin'"
                @click="routeToLoadAllEncashments"
                data-id="allleaveenchashments"
              />
              <q-list bordered class="menu-grouping-list rounded-borders">
                <q-expansion-item
                  expand-separator
                  class="text-primary"
                  label="Bonus Accrual"
                  data-id="leaves-bonusaccrual"
                >
                  <q-tab
                    name="BonusLeaveAccrualRuleConfigs"
                    icon="gavel"
                    label="Rules"
                    @click="routeToLoadToBonusLeaveConfigs"
                    v-if="$store.getters.userType == 'admin'"
                    data-id="bonusaccrual-rules"
                  />
                  <q-tab
                    name="BonusLeaveAccrualApprovalConfigs"
                    icon="approval"
                    label="Approvals"
                    @click="routeToLoadToBonusLeaveApprovalConfigs"
                    v-if="$store.getters.userType == 'admin'"
                    data-id="bonusaccrual-approval"
                  />
                </q-expansion-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-tabs>
      </template>

      <!-- right side main content area -->
      <template v-slot:after>
        <div
          class="full-width"
          style="
            display: inline-flex;
            justify-content: space-between;
            padding: 0px 16px;
            align-items: center;
          "
          v-if="tab == 'Leave Requests' || tab == 'Mine'"
        >
          <div>
            <LeaveSummary
              :users="$store.getters.user"
              :shortfallsCounts="shortfallsCounts"
              :countOfUnsettled="countOfUnsettled"
              :lwpsCounts="lwpsCounts"
              :settledLwps="settledLwps"
              :tab="tab"
            />
          </div>
          <div
            class="justify-content q-ml-lg max_width_120_px"
            v-if="tab == 'Leave Requests'"
          >
            <q-btn
              flat
              label="Apply Leave"
              color="primary"
              @click="onApplyLeave"
              data-id="applyleave"
            />
            <ApplyLeave
              :layout="applyLeaveLayout"
              :tab="tab"
              :countOfUnsettled="countOfUnsettled"
              @changeTab="redirectToLeaveRequests"
              @close="onCloseApplyleave"
            />
          </div>
        </div>
        <q-tab-panels
          v-model="tab"
          animated
          v-touch-swipe="handler"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="Mentees Leave Requests">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              style="height: 68vh !important"
              @scroll="scrolled('menteesLeaveRequests')"
              id="menteesLeaveRequests"
            >
              <LeaveRequestsCard
                v-for="(leaveRequest, index) in leaveRequests"
                :key="index"
                :leaveRequest="leaveRequest"
                :tab="tab"
                @leaveApprovedorReject="leaveApprovedorReject($event)"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Managees Leave Requests">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              style="height: 68vh !important"
              @scroll="scrolled('manageesLeaveRequests')"
              id="manageesLeaveRequests"
            >
              <LeaveRequestsCard
                v-for="(leaveRequest, index) in leaveRequests"
                :key="index"
                :leaveRequest="leaveRequest"
                :tab="tab"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Leave Requests">
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              style="height: 64vh !important"
              @scroll="scrolled('leaveRequests')"
              id="leaveRequests"
            >
              <LeaveRequestsCard
                v-for="(leaveRequest, index) in leaveRequests"
                :key="index"
                :leaveRequest="leaveRequest"
                :tab="tab"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="UserLeaveBalance">
            <div
              class="justify-between full-width"
              data-v-02cb8640=""
              style="display: inline-flex"
            ></div>
            <!-- <LeaveFilter :tab="tab" :leaveTypeOptions="leaveTypeOptions" @filter-by-name='filterByNameData' @filter-by-status='filterByStatusData' @filter-by-leave-type='filterByLeaveTypeData' @filter-by-date-range='filterByDateRangeData' /> -->

            <q-table
              title="Leave Balance"
              :rows="leavesData"
              :columns="leaveBalanceColumns"
              row-key="name"
              class="sticky-header-table"
              :rows-per-page-options="[10, 20, 50, 0]"
            >
              <template v-slot:top-right>
                <q-btn
                  flat
                  icon-right="archive"
                  label="Export to csv"
                  color="primary"
                  class="q-ml-auto text-subtitle2"
                  style=""
                  @click="exportLeaveBalance()"
                />
                <q-input
                  dense
                  debounce="300"
                  v-model="searchByUserName"
                  outlined
                  placeholder="Search by user name"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body="props">
                <q-tr
                  class="cursor-pointer text-center lwpRows"
                  :props="props"
                  :id="props.key"
                >
                  <q-td v-for="col in props.cols" :key="col.name">
                    <div
                      v-if="col.name != 'info' && col.name != 'addAccrualIcon'"
                    >
                      {{ col.value }}
                    </div>
                    <div v-else>
                      <q-btn
                        flat
                        icon="info"
                        color="warning"
                        round
                        dense
                        v-if="col.name == 'info'"
                        @click="onUserLeaveHistory(props.row)"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          class="bg-tip shadow-1"
                          :offset="[10, 10]"
                        >
                          Leave History
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        icon="add"
                        color="warning"
                        round
                        dense
                        v-if="col.name == 'addAccrualIcon'"
                        @click="onAddAccrualsByUser(props.row)"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          class="bg-tip shadow-1"
                          :offset="[10, 10]"
                        >
                          Add Accrual
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <AddAccruals
              :layout="addAccrualLayout"
              :userCurrentBalance="userCurrentBalance"
              @close="onCloseAccruals"
            />
            <LeaveHistoryTable
              :layout="leaveHistoryLayout"
              :user="userId"
              @close="leaveHistoryOnClose"
            />
          </q-tab-panel>

          <q-tab-panel name="My Accruals">
            <div
              class="justify-between full-width"
              data-v-02cb8640=""
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              @scroll="scrolled('My Accruals')"
              id="My Accruals"
              style="height: 68vh !important"
            >
              <AccrualsCard
                v-for="(Accruals, index) in leaveRequests"
                :key="index"
                :Accruals="Accruals"
                :tab="tab"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="All Accruals">
            <div
              class="justify-between full-width"
              data-v-02cb8640=""
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              @scroll="scrolled('allAccruals')"
              id="allAccruals"
              style="height: 68vh !important"
            >
              <AccrualsCard
                v-for="(Accruals, index) in leaveRequests"
                :key="index"
                :Accruals="Accruals"
                :tab="tab"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="My LWPs">
            <div
              class="bg-light-green-1 q-ml-sm shadow-2"
              style="border-radius: 5px; padding: 8px"
            >
              <div
                class="row text-secondary fs--15 text-weight-medium"
                style="justify-content: space-evenly"
              >
                <div
                  class="text-left q-pa-auto q-my-auto q-mx-sm"
                  data-id="mylwp-summarry-settledlwp"
                >
                  Settled LWPs: {{ showLwpSettled }}
                </div>
                <div
                  class="text-left q-pa-auto q-my-auto q-mx-sm"
                  data-id="mylwp-summarry-unsettledlwp"
                >
                  Unsettled LWPs: {{ showLwpUnsettled }}
                </div>
                <div
                  class="text-left q-pa-auto q-my-auto q-mx-sm"
                  data-id="mylwp-summarry-totallwp"
                >
                  Total LWPs: {{ showLwpSettled + showLwpUnsettled }}
                </div>
              </div>
            </div>

            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-settlement="filterBySettlementData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
                data-id="mylwp-settledlwp"
              >
                SETTLED LWP
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
                data-id="mylwp-tobesettledlwp"
              >
                TO BE SETTLED LWP
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 60vh !important"
                  @scroll="scrolled('LWPUnsattled')"
                  id="LWPUnsattled"
                >
                  <AccrualsCard
                    class="float-left"
                    v-for="(Accruals, index) in settledLeaves"
                    :key="index"
                    :Accruals="Accruals"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                    data-id="mylwp-lwpcard"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 60vh !important"
                  @scroll="scrolled('LWPSattled')"
                  id="LWPSattled"
                >
                  <AccrualsCard
                    class="float-left"
                    v-for="(Accruals, index) in unsettledLeaves"
                    :key="index"
                    :Accruals="Accruals"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="AllLeaves">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Export Report"
                color="primary"
                class="q-ml-auto"
              >
                <q-popup-proxy
                  @before-show="updateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="proxyDate" range mask="DD/MM/YYYY">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Cancel"
                        color="negative"
                        flat
                        v-close-popup
                      />
                      <q-btn
                        label="OK"
                        color="primary"
                        flat
                        @click="saveExport"
                        v-close-popup
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />

            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
                data-id="allleaves-settledleave"
              >
                SETTLED LEAVE
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
                data-id="allleaves-leavestobesettled"
              >
                LEAVE TO BE SETTLED
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 63vh !important"
                  @scroll="scrolled('AllLeavesSettled')"
                  id="AllLeavesSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in settledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 63vh !important"
                  @scroll="scrolled('AllLeavesUnSettled')"
                  id="AllLeavesUnSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in unsettledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :holidayDate="holidayDate"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="All LWPs">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-settlement="filterBySettlementData"
              @filter-by-date-range="filterByDateRangeData"
              @filterByMonth="filterByMonthData"
              @groupByMonth="groupByMonthData"
            />
            <div class="full-width">
              <div class="row">
                <div
                  class="text-primary q-pt-md text-weight-medium text-center"
                  style="width: 50% !important"
                  data-id="alllwps-settledlwp"
                >
                  SETTLED LWP
                </div>
                <div
                  class="q-pt-md text-weight-medium text-center"
                  style="color: rgb(242, 192, 55); width: 50% !important"
                  data-id="alllwps-tobesettledlwp"
                >
                  TO BE SETTLED LWP
                </div>
              </div>
              <q-splitter v-model="splitterModelMyLeaves" class="full-width">
                <template v-slot:before>
                  <div
                    v-if="this.groupByMonth == null"
                    class="scroll_timesheet leave-separator heightSet"
                    style="height: 63vh !important"
                    @scroll="scrolled('LeavesUnsattled')"
                    id="LeavesUnsattled"
                  >
                    <AccrualsCard
                      class="float-left"
                      v-for="(Accruals, index) in settledLeaves"
                      :key="index"
                      :Accruals="Accruals"
                      :tab="tab"
                      @reloadLeaves="getLeavesByFilter()"
                      data-id="alllwps-lwpcard"
                    />
                  </div>
                  <div
                    class="scroll_timesheet leave-separator heightSet"
                    style="height: 63vh !important"
                    v-else
                  >
                    <LWPGroupByMonth
                      v-for="data in allLwpGroupedByMonths?.settled"
                      :key="data._id"
                      :LWPData="data"
                      :settled="true"
                    />
                  </div>
                </template>
                <template v-slot:after>
                  <div
                    v-if="this.groupByMonth == null"
                    class="scroll_timesheet leave-separator heightSet"
                    style="height: 63vh !important"
                    @scroll="scrolled('LeavesSattled')"
                    id="LeavesSattled"
                  >
                    <AccrualsCard
                      class="float-left"
                      v-for="(Accruals, index) in unsettledLeaves"
                      :key="index"
                      :Accruals="Accruals"
                      :tab="tab"
                      @reloadLeaves="getLeavesByFilter()"
                    />
                  </div>
                  <div
                    class="scroll_timesheet leave-separator heightSet"
                    style="height: 63vh !important"
                    v-else
                  >
                    <LWPGroupByMonth
                      v-for="data in allLwpGroupedByMonths?.unsettled"
                      :key="data._id"
                      :LWPData="data"
                      :settled="false"
                    />
                  </div>
                </template>
              </q-splitter>
            </div>
          </q-tab-panel>

          <q-tab-panel name="AllLeaveRequests">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div
              class="scroll_timesheet leave-separator"
              style="height: 68vh !important"
              @scroll="scrolled('AllLeaveRequests')"
              id="AllLeaveRequests"
            >
              <LeaveRequestsCard
                v-for="(leaveRequest, index) in leaveRequests"
                :key="index"
                :leaveRequest="leaveRequest"
                :tab="tab"
                @reloadLeaves="getLeavesByFilter()"
              />
            </div>
          </q-tab-panel>

          <!-- <q-tab-panel name="LeaveBalance">
            <div
              class="justify-between full-width"
              style="display: inline-flex"
            >
            <LeaveFilter :tab="tab" :leaveTypeOptions="leaveTypeOptions" @filter-by-name='filterByNameData' @filter-by-status='filterByStatusData' @filter-by-leave-type='filterByLeaveTypeData' @filter-by-date-range='filterByDateRangeData' />
            </div>
              
            <div
              class="scroll_timesheet full-width"
            >
              <div class="row q-mx-md q-my-md">
                <q-table
                  style="max-height: 400px; width: 100%;"
                  class="col-md-12"
                  dense
                  :rows="userDataToDisplay"
                  :columns="columns"
                  :row-key="userData.id"
                  virtual-scroll
                  :pagination.sync="pagination"
                  :rows-per-page-options="[0]"
                />
              </div>
            </div>
          </q-tab-panel> -->

          <q-tab-panel name="Mine">
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
                data-id="myleaves-settledleaves"
              >
                SETTLED LEAVE
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
                data-id="myleaves-leavetobesettled"
              >
                LEAVE TO BE SETTLED
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 60vh !important"
                  @scroll="scrolled('MineLeavesSettled')"
                  id="MineLeavesSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in settledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator heightSet"
                  style="height: 60vh !important"
                  @scroll="scrolled('MineLeavesUnsettled')"
                  id="MineLeavesUnsettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in unsettledLeaves"
                    :key="index"
                    :holidayDate="holidayDate"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="My Mentees">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
                data-id="mymentees-settledleaves"
              >
                SETTLED LEAVE
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
                data-id="mymentees-leavestobesettled"
              >
                LEAVE TO BE SETTLED
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator"
                  style="height: 62.5vh !important"
                  @scroll="scrolled('myMenteesLeavesSettled')"
                  id="myMenteesLeavesSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in settledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator"
                  style="height: 62.5vh !important"
                  @scroll="scrolled('myMenteesLeavesUnSettled')"
                  id="myMenteesLeavesUnSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in unsettledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="My Managees">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />
            <div class="row">
              <div
                class="text-primary q-pt-md text-weight-medium text-center"
                style="width: 50% !important"
                data-id="mymanagees-settledleave"
              >
                SETTLED LEAVE
              </div>
              <div
                class="q-pt-md text-weight-medium text-center"
                style="color: rgb(242, 192, 55); width: 50% !important"
                data-id="mymanagees-leavetobesettled"
              >
                LEAVE TO BE SETTLED
              </div>
            </div>
            <q-splitter v-model="splitterModelMyLeaves" class="full-width">
              <template v-slot:before>
                <div
                  class="scroll_timesheet leave-separator"
                  style="height: 62.5vh !important"
                  @scroll="scrolled('myManageesLeavesSettled')"
                  id="myManageesLeavesSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in settledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div
                  class="scroll_timesheet leave-separator"
                  style="height: 62.5vh !important"
                  @scroll="scrolled('myManageesLeavesUnSettled')"
                  id="myManageesLeavesUnSettled"
                >
                  <Leave
                    class="float-left"
                    v-for="(leave, index) in unsettledLeaves"
                    :key="index"
                    :leavesData="leave"
                    :tab="tab"
                    @reloadLeaves="getLeavesByFilter()"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>

          <q-tab-panel name="Leave Card">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              @scroll="scrolled('LeaveCard')"
              id="LeaveCard"
            >
              <LeaveCard
                v-for="(leave, index) in leavesData"
                :key="index"
                :leavesData="leave"
                :tab="tab"
              />
            </div>
          </q-tab-panel>

          <!-- <q-tab-panel name="leaveType">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <AddLeaveType
                class="q-ml-auto q-mr-md"
                :layout="editLeaveType"
                :setDataForEdit="setDataForEdit"
                :data="leaveTypeData"
                @close="onCloseAddLeaveType"
              />
              <AddLeaveCardBalance :leaveType="leavesData" />
            </div>

            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div class="denote_color q-mt-sm">
                <ul>
                  <li v-for="data in denoteColorsForLeaveType" :key="data">
                    <span
                      class="color_dot"
                      :style="{ backgroundColor: data.color }"
                    ></span>
                    <span> {{ data.text }} </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <LeaveType
                v-for="(leave, index) in leavesData"
                :key="index"
                :eventData="leave"
                @editLayout="onEditLeaveType"
              />
            </div>
          </q-tab-panel> -->

          <q-tab-panel name="shortfallSheet">
            <div
              class="justify-between full-width"
              data-v-02cb8640=""
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              style="height: 73vh !important"
              @scroll="scrolled('ShortFallSheet')"
              id="ShortFallSheet"
            >
              <shortfallSheet
                v-for="(leaves, index) in leavesData"
                :key="index"
                :shortfallData="leaves"
                @editLayout="onEditLeaveType"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="compoffSheets">
            <div
              class="justify-between full-width"
              data-v-02cb8640=""
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              style="height: 68vh"
              id="CompoffTimesheetId"
            >
              <CompoffTimesheet
                v-for="(timesheet, index) in timeSheetsToDisplay"
                :key="String(timesheet.date) + index"
                :timesheet="timesheet"
                @approveCompoffSheet="onApproveCompoffSheet"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="All Leave Card">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            ></div>
            <LeaveFilter
              :clearFilters="clearFiltersValue"
              :tab="tab"
              :leaveTypeOptions="leaveTypeOptions"
              @filter-by-name="filterByNameData"
              @filter-by-status="filterByStatusData"
              @filter-by-leave-type="filterByLeaveTypeData"
              @filter-by-date-range="filterByDateRangeData"
            />

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              @scroll="scrolled('AllLeaveCard')"
              id="AllLeaveCard"
            >
              <LeaveCard
                v-for="(leave, index) in leavesData"
                :key="index"
                :leavesData="leave"
                :tab="tab"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel
            name="AccruedConfigurations"
            style="padding-top: unset !important"
          >
            <div class="text-right">
              <q-btn
                flat
                label="Add Accrual Config"
                color="primary"
                @click="addAccuralsConfig"
              />
              <q-table
                title="Accrual Configurations"
                :rows="leavesData"
                :columns="accruedColumns"
                row-key="name"
                class="sticky-header-table"
                :rows-per-page-options="[10, 20, 50, 0]"
              >
                <template v-slot:body="props">
                  <q-tr
                    class="cursor-pointer text-center lwpRows"
                    :props="props"
                    :id="props.key"
                  >
                    <!-- {{props.key}} -->
                    <q-td v-for="col in props.cols" :key="col.name">
                      <div v-if="col.name != 'edit' && col.name != 'delete'">
                        {{ col.value }}
                      </div>
                      <div v-else>
                        <q-btn
                          flat
                          icon="edit"
                          color="warning"
                          round
                          dense
                          v-if="col.name == 'edit'"
                          @click="onEditDeleteAccruals(props.row, true)"
                        >
                          <q-tooltip
                            anchor="top middle"
                            self="bottom middle"
                            class="bg-tip shadow-1"
                            :offset="[10, 10]"
                          >
                            Edit
                          </q-tooltip>
                        </q-btn>

                        <q-toggle
                          :false-value="true"
                          :true-value="false"
                          :class="
                            props.row.softDeleted ? 'text-red' : 'text-green'
                          "
                          v-if="col.name == 'delete'"
                          v-model="props.row.softDeleted"
                          @click="onEditDeleteAccruals(props.row, false)"
                        >
                          <q-tooltip
                            anchor="top middle"
                            self="bottom middle"
                            class="bg-tip shadow-1"
                            :offset="[10, 10]"
                          >
                            {{ props.row.softDeleted ? "Disabled" : "Enabled" }}
                          </q-tooltip>
                        </q-toggle>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <AddConfigurations
                :layout="applyAccrualsLayout"
                :accrualData="accrualData"
                :setAccrualForEdit="setAccrualForEdit"
                @close="onCloseAccruals"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="LeaveEncashmentAdmin" style="padding-top: 2%">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilterEncashment"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="getAllLeaveEncashmentFIlter"
                @keydown.enter="getAllLeaveEncashmentFIlter"
                dense
                data-id="allleaveencashment-searchbyname"
                ><template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-input
                outlined
                v-model="dateFilterEncashmentAdmin"
                class="q-px-sm col-4"
                label="Search by Financial Year"
                lazy-rules
                dense
                clearable
                @clear="dateFilterEncashment = null"
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
                    v-model="dateFilterEncashment"
                    years-in-month-view
                    default-view="Years"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="YYYY"
                    class="myDate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="session_year">{{ searchFilterTextShowFinancial }}</div>
            <LeaveEncashment
              :leavesEncashmentData="allLeavesEncashmentData"
              :enTabName="'LeaveEncashmentAdmin'"
              @close="closeLeaveEncashment"
            />
          </q-tab-panel>
          <q-tab-panel name="LeaveEncashment" style="padding-top: 5%">
            <LeaveEncashment
              :myLeavesEncashmentData="myLeavesEncashmentData"
              :enTabName="'LeaveEncashment'"
              @close="closeLeaveEncashmentByUesr"
            />
          </q-tab-panel>
          <q-tab-panel
            name="BonusLeaveAccrualRuleConfigs"
            style="padding-top: unset !important"
          >
            <BonusLeaveAccrual
              :bonusRuleData="bonusRuleData"
              @close="closeAddConfig"
            />
          </q-tab-panel>
          <q-tab-panel
            name="BonusLeaveAccrualApprovalConfigs"
            style="padding-top: unset !important"
          >
            <div
              class="fit row wrap justify-start items-start content-start full-width"
              style="margin-top: 20px"
            >
              <q-input
                outlined
                v-model="nameFilterBonus"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="getAdminBonusByFilter"
                @keydown.enter="getAdminBonusByFilter"
                dense
                data-id="approvals-searchbyname"
                ><template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilterBonus"
                :options="['Approved', 'Pending', 'Rejected']"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="getAdminBonusByFilter"
                @keydown.enter="getAdminBonusByFilter"
                dense
                data-id="approvals-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
            </div>

            <div class="denote_color q-mt-sm">
              <ul>
                <li v-for="data in denoteColors3" :key="data">
                  <span
                    class="color_dot"
                    :style="{ backgroundColor: data.color }"
                  ></span>
                  <span> {{ data.text }} </span>
                </li>
              </ul>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
              style="height: 73vh !important; margin-top: 20px"
              @scroll="scrolled('bonusApproval')"
              id="bonusApproval"
            >
              <BonusLeaveApproval
                v-for="(bonus, index) in bonusRuleApprovalData"
                :key="index"
                :bonusRuleApprovalData="bonus"
                @close="closeApprovalConfig"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
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
            Invalid Data
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errorMsg }}
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
  </div>
</template>

<script>
import ApplyLeave from "../components/Leaves/ApplyForLeave.vue";
import Leave from "../components/Leaves/leave.vue";
import LeaveCard from "../components/Leaves/leaveCard.vue";
import * as eventsService from "../services/events.service";
import * as leavesService from "../services/leaves.service";
import * as usersService from "../services/users.service";
// import flow_levelService from "../services/flow_level.service";
import moment from "moment";
import AccrualsCard from "src/components/Leaves/AccrualsCard.vue";
import BonusLeaveAccrual from "src/components/Leaves/BonusLeaveAccrual.vue";
import BonusLeaveApproval from "src/components/Leaves/BonusLeaveApproval.vue";
import LeaveEncashment from "src/components/Leaves/Encashment/LeaveEncashment.vue";
import LWPGroupByMonth from "src/components/Leaves/LWPGroupByMonth.vue";
import LeaveRequestsCard from "src/components/Leaves/LeaveRequestsCard.vue";
import { ref } from "vue";
import CompoffTimesheet from "../components/CompoffTimesheet.vue";
import AddAccruals from "../components/Leaves/AddAccruals.vue";
import AddConfigurations from "../components/Leaves/AddConfigurations.vue";
import AddLeaveCardBalance from "../components/Leaves/AddLeaveCardBalance.vue";
import LeaveFilter from "../components/Leaves/LeaveFliter.vue";
import LeaveHistoryTable from "../components/Leaves/LeaveHistoryTable.vue";
import LeaveSummary from "../components/Leaves/LeaveSummary.vue";
import LeaveType from "../components/Leaves/LeaveType.vue";
import shortfallSheet from "../components/Leaves/ShortfallSheet.vue";
import * as accrualsService from "../services/accruals.service";
import * as functions from "../services/functions";
import * as timsheetService from "../services/timesheets.service";

export default {
  components: {
    LWPGroupByMonth,
    LeaveFilter,
    Leave,
    ApplyLeave,
    LeaveCard,
    LeaveType,
    AddLeaveCardBalance,
    shortfallSheet,
    CompoffTimesheet,
    LeaveSummary,
    LeaveRequestsCard,
    AddConfigurations,
    AccrualsCard,
    LeaveHistoryTable,
    AddAccruals,
    BonusLeaveAccrual,
    BonusLeaveApproval,
    LeaveEncashment,
  },
  created() {},
  data() {
    return {
      filterByMonth: null,
      allLwpGroupedByMonths: {},
      groupByMonth: null,
      monthFilter: null,
      tabChanged: false,
      nameFilterBonus: "",
      nameFilterEncashment: "",
      dateFilterEncashment: null,
      showLwpSettled: 0,
      showLwpUnsettled: 0,
      showLwpBySalary: 0,
      showLwpByLeaveBal: 0,
      clearFiltersValue: false,
      searchByUserName: "",
      userId: "",
      nameFilter: "",
      statusFilter: "",
      nameFilter2: "",
      statusFilter2: "",
      splitterModel: "",
      splitterModelMyLeaves: 50,
      dateFilter: null,
      dateFilter2: null,
      proxyDate: null,
      exportDate: null,
      tab: "Mine",
      applyLeaveLayout: false,
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
          text: "Cancelled",
          color: "#373737",
        },
        {
          text: "Rejected",
          color: "#C10015 ",
        },
        {
          text: "Lapsed",
          color: "#C10015",
        },
      ],
      denoteColors2: [
        {
          text: "Positive Impact",
          color: "#93BE3B ",
        },
        {
          text: "Negative Impact",
          color: "#C10015 ",
        },
      ],
      denoteColors3: [
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
      userDataToDisplay: [],
      userDataToDisplay2: [],
      userData: [
        {
          id: 1,
          name: "Kartavya Neema",
          balance: "2",
          satCompOff: "2",
          sunCompOff: "1",
          totalBalance: "5",
        },
      ],
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "Balance",
          label: "Leave Balance",
          field: "balance",
          align: "left",
          sortable: true,
        },
        {
          name: "satCompOff",
          label: "Saturday Compoff",
          field: "satCompOff",
          align: "left",
          sortable: true,
        },
        {
          name: "sunCompOff",
          label: "Sunday Compoff",
          field: "sunCompOff",
          align: "left",
          sortable: true,
        },
        {
          name: "totalBalance",
          label: "Total Balance",
          field: "totalBalance",
          align: "left",
          sortable: true,
        },
      ],
      allLeavesData: [],
      leavesData: [],
      settledLeaves: [],
      unsettledLeaves: [],
      leaveTypeOptions: [],
      skip: 0,
      MyLeaveCounts: 0,
      dateFilterLeaves: null,
      nameFilterAllLeaves: "",
      prevNameFilterAllLeaves: "",
      nameFilterLeaveBalance: "",
      statusFilterAllLeaves: "",
      projectFilterAllLeaves: "",
      errorLayout: false,
      errorMsg: "",
      dontClearFilters: false,
      denoteColorsForLeaveType: [
        {
          text: "Positive Impact",
          color: "#93BE3B ",
        },
        {
          text: "Negative Impact",
          color: "#C10015",
        },
      ],
      leaveTypeData: "",
      setDataForEdit: false,
      editLeaveType: false,
      timeSheets: [
        {
          date: null,
          user: "",
          data: [],
          color: "",
          border: "",
        },
      ],
      timeSheetsToDisplay: [],
      nameFilterForCompoff: "",
      statusFilterForCompoff: "",
      leaveRequests: [],
      isBelongsToMyMentees: false,
      accruedColumns: [
        {
          name: "typeOfLeave",
          label: "Type Of Leave",
          align: "center",
          field: "typeOfLeave",
        },
        {
          name: "empStatus",
          label: "Emp Status",
          field: "empStatus",
          align: "center",
        },
        { name: "grade", label: "Grade", field: "grade", align: "center" },
        {
          name: "periodicity",
          label: "Periodicity",
          field: "periodicity",
          align: "center",
        },
        {
          name: "leaveRate",
          label: "Leave Rate",
          field: "leaveRate",
          align: "center",
        },
        {
          name: "priority",
          label: "Priority",
          field: "priority",
          align: "center",
        },
        { name: "edit", label: "Edit", field: "edit", align: "center" },
        { name: "delete", label: "Active", field: "delete", align: "center" },
      ],
      leaveBalanceColumns: [
        { name: "name", label: "Name", align: "center", field: "name" },
        {
          name: "grossPlcl",
          label: "Gross PL/CL",
          field: "grossPlcl",
          align: "center",
        },
        {
          name: "availablePlcl",
          label: "Available PL/CL",
          field: "availablePlcl",
          align: "center",
        },
        {
          name: "plclToBeFrozen",
          label: "PL/CL To Be Frozen",
          field: "plclToBeFrozen",
          align: "center",
        },
        {
          name: "frozenPlcl",
          label: "Frozen PL/CL",
          field: "frozenPlcl",
          align: "center",
        },
        {
          name: "compOffs",
          label: "Comp Off",
          field: "compOffs",
          align: "center",
        },
        {
          name: "bonusLeaves",
          label: "Bonus",
          field: "bonusLeaves",
          align: "center",
        },
        {
          name: "optionalLeaves",
          label: "Optional",
          field: "optionalLeaves",
          align: "center",
        },
        {
          name: "settledLwps",
          label: "Settled LWP",
          field: "settledLwps",
          align: "center",
        },
        {
          name: "unsettledLwps",
          label: "Unsettled LWP",
          field: "unsettledLwps",
          align: "center",
        },
        {
          name: "shortfalls",
          label: "Shortfalls",
          field: "shortfalls",
          align: "center",
        },
        {
          name: "Unsettled",
          label: "Unsettled Leaves",
          field: "Unsettled",
          align: "center",
        },
        {
          name: "isEligibleForSpecialLeave",
          label: "Special",
          field: "isEligibleForSpecialLeave",
          align: "center",
        },
        { name: "info", label: "History", field: "info", align: "center" },
        {
          name: "addAccrualIcon",
          label: "Add",
          field: "addAccrualIcon",
          align: "center",
        },
      ],
      applyAccrualsLayout: false,
      setAccrualForEdit: false,
      accrualData: {},
      countOfUnsettled: 0,
      shortfallsCounts: 0,
      lwpsCounts: 0,
      settledLwps: 0,
      userCurrentBalance: {},
      leaveHistoryLayout: false,
      addAccrualLayout: false,
      settlementByLwps: "",
      settledByLeaveBalanceCount: 0,
      settledBySalaryCount: 0,
      holidayDate: [],
      bonusRuleData: [],
      exportBalanceData: [],
      bonusRuleApprovalData: [],
      statusFilterBonus: "",
      successMsg: "",
      myLeavesEncashmentData: [],
      allLeavesEncashmentData: [],
      searchFilterTextShowFinancial: "",
      unSettledSkip: 0,
      unSettledLeavesData: [],
      prevStatusFilter: "",
    };
  },
  watch: {
    searchByUserName: function (newVal) {
      if (newVal != null) {
        this.leavesData = this.allLeavesData;
        this.exportBalanceData = this.allLeavesData;
        this.filterByName2();
      }
    },
    nameFilterAllLeaves: function (newVal) {
      if (!(newVal == "" && this.prevNameFilterAllLeaves == "")) {
        this.getLeavesByFilter();
      }
    },
    filterByMonth: function (val) {
      this.getLeavesByFilter();
    },
    nameFilter: function (newVal) {
      this.filter();
    },
    nameFilterForCompoff: function (newVal) {
      this.filter();
    },
    statusFilterForCompoff: function (newVal) {
      this.filter();
    },
    nameFilter2: function (newVal) {
      this.filter();
    },
    nameFilterLeaveBalance: function (newVal) {
      this.getLeaveBalanceByFilter();
    },
    statusFilter: function (newVal) {
      this.filter();
    },
    statusFilter2: function (newVal) {
      this.filter();
    },
    dateFilter: function (newVal) {
      this.$refs.qDateProxy.hide();
      this.filter();
    },
    dateFilter2: function (newVal) {
      this.filter();
    },
    dateFilterLeaves: function (newVal) {
      if (this.tabChanged || newVal != null) {
        this.getLeavesByFilter();
      }
      this.tabChanged = true;
    },
    statusFilterAllLeaves: function (newVal) {
      this.getLeavesByFilter();
    },
    settlementByLwps: function (newVal) {
      if (!(newVal == "" && this.prevStatusFilter == "")) {
        this.getLeavesByFilter();
      }
    },
    tab: function (val) {
      this.searchByUserName = null;
      this.skip = 0;
      this.unSettledSkip = 0;
      this.MyLeaveCounts = 0;
      this.leavesData = [];
      this.unSettledLeavesData = [];
      this.leaveRequests = [];
      this.nameFilterAllLeaves = "";
      this.statusFilterAllLeaves = "";
      this.settlementByLwps = "";
      this.nameFilterLeaveBalance = "";
      this.dateFilterLeaves = null;
      this.settledLeaves = [];
      this.unsettledLeaves = [];
      this.timeSheetsToDisplay = [];
      this.statusFilterBonus = "";
      this.nameFilterBonus = "";
      this.dateFilterEncashment = null;
      this.nameFilterEncashment = "";
      this.searchFilterTextShowFinancial = "";
      this.allLwpGroupedByMonths = {};
      this.filterByMonth = null;
      this.groupByMonth = null;
      this.prevNameFilterAllLeaves = "";
      this.prevStatusFilter = "";
    },
    nameFilterBonus: function (newVal) {
      this.getAdminBonusByFilter();
    },
    nameFilterEncashment: function (newVal) {
      this.getAllLeaveEncashmentFIlter();
    },
    dateFilterEncashment: function (newVal) {
      this.getAllLeaveEncashmentFIlter();
    },
    statusFilterBonus: function (newVal) {
      if (newVal) {
        this.getAdminBonusByFilter();
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
  computed: {
    dateFilterEncashmentAdmin: {
      get() {
        if (this.dateFilterEncashment) {
          return this.dateFilterEncashment;
        } else {
          return "";
        }
      },
    },
    dateFilterConverted: {
      get() {
        if (this.dateFilter) {
          if (this.dateFilter.from) {
            return this.dateFilter.from + " - " + this.dateFilter.to;
          } else {
            return this.dateFilter + " - " + this.dateFilter;
          }
        } else {
          return "";
        }
      },
    },
    dateFilterConverted2: {
      get() {
        if (this.dateFilter2) {
          if (this.dateFilter2.from) {
            return this.dateFilter2.from + " - " + this.dateFilter2.to;
          } else {
            return this.dateFilter2 + " - " + this.dateFilter2;
          }
        } else {
          return "";
        }
      },
    },
    dateFilterAllLeaves: {
      get() {
        if (this.dateFilterLeaves) {
          if (this.dateFilterLeaves.from) {
            return (
              this.dateFilterLeaves.from + " - " + this.dateFilterLeaves.to
            );
          } else {
            return this.dateFilterLeaves + " - " + this.dateFilterLeaves;
          }
        } else {
          return "";
        }
      },
    },
    dateFilterConvertedForCompoff: {
      get() {
        if (this.dateFilter) {
          if (this.dateFilter.from) {
            return this.dateFilter.from + " - " + this.dateFilter.to;
          } else {
            return this.dateFilter + " - " + this.dateFilter;
          }
        } else {
          return "";
        }
      },
    },
  },
  methods: {
    getMyLeaveEncashmentFIlter() {
      this.$q.loading.show();
      this.skip = 0;
      //if filter else call
      //this.loadToLeaveEncashmentFilterRecords();
      this.loadToMyLeaveEncashmentRecords();
      this.$q.loading.hide();
    },
    getAllLeaveEncashmentFIlter() {
      this.$q.loading.show();
      this.skip = 0;
      if (
        (!this.nameFilterEncashment || this.nameFilterEncashment == null) &&
        this.dateFilterEncashment == null
      ) {
        this.loadToAllLeaveEncashmentRecords();
      } else {
        if (this.dateFilterEncashment !== null) {
          this.searchFilterTextShowFinancial =
            "Financial Year : " +
            Number(this.dateFilterEncashment - 1) +
            " - " +
            Number(this.dateFilterEncashment);
        }
        this.loadToAllLeaveEncashmentFilterRecords();
      }
      this.$q.loading.hide();
    },
    getAdminBonusByFilter() {
      this.$q.loading.show();
      this.skip = 0;
      this.bonusRuleApprovalData = [];

      if (
        (!this.nameFilterBonus || this.nameFilterBonus == null) &&
        (this.statusFilterBonus == null || this.statusFilterBonus == "")
      ) {
        this.loadToBonusLeaveApprovalRecords();
      } else {
        this.loadToBonusLeaveApprovalRecordsFilter();
      }
      this.$q.loading.hide();
    },
    async loadToBonusLeaveApprovalRecordsFilter() {
      this.$q.loading.show();
      if (this.tab == "BonusLeaveAccrualApprovalConfigs") {
        let res = await leavesService.fetchAllBonusApprovalByFilter({
          name: this.nameFilterBonus ? this.nameFilterBonus : "",
          status: this.statusFilterBonus ? this.statusFilterBonus : "",
        });
        this.bonusRuleApprovalData = res.data;
      }
      this.$q.loading.hide();
    },
    async loadToMyLeaveEncashmentRecords() {
      this.$q.loading.show();
      const res = await leavesService.fetchMyLeavesEncashment(
        this.$store.getters.userId,
        this.skip,
      );
      this.skip += 200;
      this.myLeavesEncashmentData = res.data;
      this.$q.loading.hide();
    },
    async loadToAllLeaveEncashmentRecords() {
      this.$q.loading.show();
      const res = await leavesService.fetchAllLeavesEncashment();
      this.skip += 200;
      this.searchFilterTextShowFinancial = "";
      this.allLeavesEncashmentData = res.data;
      this.$q.loading.hide();
    },
    async loadToAllLeaveEncashmentFilterRecords() {
      this.$q.loading.show();
      if (this.tab == "LeaveEncashmentAdmin") {
        let res = await leavesService.fetchAllLeavesEncashmentByFilter({
          name: this.nameFilterEncashment ? this.nameFilterEncashment : "",
          year: this.dateFilterEncashment ? this.dateFilterEncashment : "",
        });
        this.allLeavesEncashmentData = res.data;
      }
      this.$q.loading.hide();
    },
    async getHolidays() {
      const res = await eventsService.fetchAllHolidays();
      this.holidayDate = [];
      res.data.forEach((holiday) => {
        if (holiday.status) {
          this.holidayDate.push(
            new Date(
              new Date(holiday.holidayDate).setHours(0, 0, 0, 0),
            ).toString(),
          );
        }
      });
    },
    onUserLeaveHistory(row) {
      this.userId = row._id;
      this.leaveHistoryLayout = true;
    },
    onAddAccrualsByUser(row) {
      this.userId = row._id;
      this.userCurrentBalance = row;
      this.addAccrualLayout = true;
    },
    leaveHistoryOnClose() {
      this.userId = "";
      this.leaveHistoryLayout = false;
    },
    addAccuralsConfig() {
      this.applyAccrualsLayout = true;
    },
    async onEditDeleteAccruals(row, bool) {
      try {
        this.$q.loading.show();
        if (!bool) {
          var softDeleted = row.softDeleted;
          const res = await accrualsService.deleteAccrualConfigRecords(
            row._id,
            softDeleted,
          );

          if (res.data) {
            this.successMsg = "Delete Accrual Successfully";
            this.onCloseAccruals();
          }
        } else {
          this.accrualData = row;
          this.applyAccrualsLayout = true;
          this.setAccrualForEdit = true;
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    onCloseAccruals() {
      this.userId = "";
      this.addAccrualLayout = false;
      this.applyAccrualsLayout = false;
      this.setAccrualForEdit = false;
      this.accrualData = {};
      this.userCurrentBalance = {};
      if (this.tab == "AccruedConfigurations") {
        this.routeToLoadToAccruedConfigurations();
      } else if (this.tab == "UserLeaveBalance") {
        this.routeToLoadToUsersLeaveBalance();
      }
    },
    async groupByMonthData(month) {
      if (this.tab == "All LWPs") {
        this.groupByMonth = month;
        this.$q.loading.show();
        const res = await leavesService.getAllSettledLwpGroupedByMonth({
          month: this.groupByMonth,
        });
        const res2 = await leavesService.getAllUnsettledLwpGroupedByMonth({
          month: this.groupByMonth,
        });
        if (res.status == 200 && res2.status == 200) {
          this.allLwpGroupedByMonths = {
            settled: res.data,
            unsettled: res2.data,
          };
        }
        this.$q.loading.hide();
      }
    },
    filterByMonthData(month) {
      if (this.tab == "All LWPs") {
        this.filterByMonth = month;
      }
    },
    filterByNameData(name) {
      if (this.tab == "LeaveBalance") this.nameFilterLeaveBalance = name;
      else if (this.tab == "My Projects") this.nameFilter = name;
      else this.nameFilterAllLeaves = name == null || name == "" ? "" : name;
    },
    async filterByStatusData(status) {
      if (!status) {
        this.statusFilterAllLeaves = "";
        this.getLeavesByFilter();
      } else {
        this.tab == "My Projects"
          ? (this.statusFilter = status)
          : (this.statusFilterAllLeaves = status);
      }
    },
    filterByDateRangeData(dateRange) {
      this.dateFilterLeaves = dateRange;
    },
    filterByLeaveTypeData(leaveType) {
      if (!leaveType) {
        this.statusFilterAllLeaves = "";
        this.getLeavesByFilter();
      } else {
        this.statusFilterAllLeaves = leaveType;
      }
    },
    filterBySettlementData(settlement) {
      if (!settlement && this.prevStatusFilter != "") {
        this.settlementByLwps = "";
        this.prevStatusFilter = "";
        this.getLeavesByFilter();
      } else {
        this.settlementByLwps = settlement;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    handler() {
      event.preventDefault();
    },
    async onApplyLeave() {
      this.applyLeaveLayout = true;
    },
    onCloseApplyleave() {
      this.applyLeaveLayout = false;
      // this.routeToGetMyLeaves();
      this.routeToLoadLeaveRequests();
    },
    redirectToLeaveRequests() {
      this.applyLeaveLayout = false;
      this.tab = "Leave Requests";
      this.$store.commit("changeTabName", "Leave Requests");
      this.routeToLoadLeaveRequests();
    },
    async approveUserLeave() {
      this.$q.loading.show();
      this.dontClearFilters = true;
      if (this.tab == "Mine") await this.routeToGetMyLeaves();
      if (this.tab == "My Mentees") await this.routeToGetMyMentees();
      if (this.tab == "My Managees") await this.routeToGetMyManagees();
      this.$q.loading.hide();
    },
    async getUserSettledLeaves() {
      if (this.dontClearFilters == false) {
        this.clearFilters();
      }
      this.allLeavesData = [];
      const res = await leavesService.fetchUserSettledLeaves(
        this.$store.getters.userId,
        this.skip,
      );
      this.skip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((mentees) => {
        this.leavesData.findIndex((ld) => ld._id == mentees._id) == -1
          ? this.leavesData.push(mentees)
          : "";
      });
      if (this.leavesData.length > 0) {
        this.$q.loading.show();
        this.settledLeaves = this.leavesData.filter((leaves) => leaves.settled);
      }
      this.$store.commit("changeTabName", "My Leaves");
      if (this.dontClearFilters) {
        await this.getLeavesByFilter();
        this.dontClearFilters = false;
      }
      this.$q.loading.hide();
    },
    async getUserUnsettledLeaves() {
      if (this.dontClearFilters == false) {
        this.clearFilters();
      }
      this.allLeavesData = [];
      const res = await leavesService.fetchUserUnsettledLeaves(
        this.$store.getters.userId,
        this.unSettledSkip,
      );
      this.unSettledSkip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((mentees) => {
        this.unSettledLeavesData.findIndex((ld) => ld._id == mentees._id) == -1
          ? this.unSettledLeavesData.push(mentees)
          : "";
      });

      if (this.unSettledLeavesData.length > 0) {
        this.$q.loading.show();
        this.unsettledLeaves = this.unSettledLeavesData.filter(
          (leaves) => !leaves.settled,
        );
      }
      if (this.dontClearFilters) {
        await this.getLeavesByFilter();
        this.dontClearFilters = false;
      }
      this.$q.loading.hide();
    },
    async routeToGetMyMentees() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "My Mentees") {
        this.skip = 0;
        this.unSettledSkip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.unSettledLeavesData = [];
        await this.getMyMenteesSettledLeaves();
        await this.getMyMenteesUnsettledLeaves();
      }
    },
    routeToGetMyMenteesLeaveRequests() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "Mentees Leave Requests") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leaveRequests = [];
        this.getToMyMenteesLeaveRequests();
      }
    },
    routeToGetMyManageesLeaveRequests() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "Managees Leave Requests") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leaveRequests = [];
        this.getToMyManageesLeaveRequests();
      }
    },
    routeToLoadToAllLeaveRequest() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "AllLeaveRequests") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leaveRequests = [];
        this.loadToAllLeaveRequest();
      }
    },
    async loadToAllLeaveRequest() {
      this.$q.loading.show();
      let res = await leavesService.loadToAllLeaveRequest(this.skip);
      this.skip += res.data.length;
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          if (element._id != this.$store.getters.userId) {
            let data = [];
            element.cancelledLeaveDates.forEach((ele) => {
              data.push(functions.convertDateToDate(ele));
            });
            element.cancelledLeaveDatesArray = data.join(", ");
            data = [];
            element.rejectedLeaveDates.forEach((ele) => {
              data.push(functions.convertDateToDate(ele));
            });
            element.rejectedLeaveDatesArray = data.join(", ");
            this.leaveRequests.push(element);
          }
        });
      }
      this.$store.commit("changeTabName", "All Leave Request");
      this.$q.loading.hide();
    },
    async routeToGetMyLeaves() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "Mine") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.unSettledLeavesData = [];
        await this.shortfallsCountsCal();
        await this.getUserSettledLeaves();
        await this.getUserUnsettledLeaves();
      }
    },
    routeToGetLeaveTypes() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "leaveType") {
        this.leavesData = [];
        this.getAllLeaveTypes();
      }
    },
    routeToGetShortfallSheet() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "shortfallSheet") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.getShortfallSheet();
      }
    },
    routeToLoadcompoffTimeSheets() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "compoffSheets") {
        this.timeSheetsToDisplay = [];
        this.loadcompoffTimeSheets();
      }
    },
    routeToLoadToAccruedConfigurations() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "AccruedConfigurations") {
        this.leavesData = [];
        this.loadToAccruedConfigRecords();
      }
    },
    routeToLoadToBonusLeaveConfigs() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "BonusLeaveAccrualRuleConfigs") {
        this.bonusRuleData = [];
        this.loadToBonusLeaveAccrualRecords();
      }
    },
    routeToLoadToBonusLeaveApprovalConfigs() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "BonusLeaveAccrualApprovalConfigs") {
        this.getAdminBonusByFilter();
      }
    },
    routeToLoadAllEncashments() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "LeaveEncashmentAdmin") {
        this.getAllLeaveEncashmentFIlter();
        this.$store.commit("changeTabName", "All Leave Encashment");
      }
    },
    routeToLoadMyEncashments() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "LeaveEncashment") {
        this.getMyLeaveEncashmentFIlter();
        this.$store.commit("changeTabName", "My Leave Encashment");
      }
    },
    closeAddConfig() {
      this.routeToLoadToBonusLeaveConfigs();
    },
    closeApprovalConfig() {
      this.routeToLoadToBonusLeaveApprovalConfigs();
    },
    closeLeaveEncashment() {
      this.routeToLoadAllEncashments();
    },
    closeLeaveEncashmentByUesr() {
      this.routeToLoadMyEncashments();
    },
    routeToLoadLeaveCardAllHistory() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "All Leave Card") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.loadLeaveCardAllHistory();
        this.getLeaveTypes();
      }
    },
    async shortfallsCountsCal() {
      const res1 = await leavesService.fetchMyShortfalls(
        this.$store.getters.userId,
      );
      this.shortfallsCounts = res1.data.shortfalls;
      this.countOfUnsettled = res1.data.unSettledLeaves;
      this.lwpsCounts = this.$store.getters.user.lwps;
      this.settledLwps = res1.data.settledLwps;
    },
    async getMyMenteesSettledLeaves() {
      this.$q.loading.show();
      this.clearFilters();
      this.allLeavesData = [];
      const res = await leavesService.fetchMyMenteesSettledLeaves({
        userId: this.$store.getters.userId,
        skip: this.skip,
      });
      this.skip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((mentees) => {
        this.leavesData.push(mentees);
      });

      if (this.leavesData.length > 0) {
        this.settledLeaves = this.leavesData.filter((leaves) => leaves.settled);
      }
      this.$store.commit("changeTabName", "My Mentees");
      this.$q.loading.hide();
    },
    async getMyMenteesUnsettledLeaves() {
      this.$q.loading.show();
      this.clearFilters();
      this.allLeavesData = [];
      const res = await leavesService.fetchMyMenteesUnsettledLeaves({
        userId: this.$store.getters.userId,
        skip: this.unSettledSkip,
      });
      this.unSettledSkip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((mentees) => {
        this.unSettledLeavesData.findIndex((ld) => ld._id == mentees._id) == -1
          ? this.unSettledLeavesData.push(mentees)
          : "";
      });

      if (this.unSettledLeavesData.length > 0) {
        this.unsettledLeaves = this.unSettledLeavesData.filter(
          (leaves) => !leaves.settled,
        );
      }
      this.$store.commit("changeTabName", "My Mentees");
      this.$q.loading.hide();
    },
    async loadToLeaveRequestsByUserId() {
      this.$q.loading.show();
      var res = await leavesService.leaveRequestsByUserId(
        this.$store.getters.userId,
        this.skip,
      );
      this.skip += res.data.length;
      if (res.data.length > 0) {
        this.leaveRequests = [];
        res.data.forEach((element) => {
          let data = [];
          element.cancelledLeaveDates.forEach((ele) => {
            data.push(functions.convertDateToDate(ele));
          });
          element.cancelledLeaveDatesArray = data.join(", ");
          data = [];
          element.rejectedLeaveDates.forEach((ele) => {
            data.push(functions.convertDateToDate(ele));
          });
          element.rejectedLeaveDatesArray = data.join(", ");
          this.leaveRequests.push(element);
        });
      }
      this.$store.commit("changeTabName", "Leave Requests");
      this.$q.loading.hide();
    },
    async leaveApprovedorReject(data) {
      this.$q.loading.show();
      let index = this.leaveRequests.findIndex(
        (array) => array._id == data.user,
      );
      if (data.status == "approved") {
        this.leaveRequests[index].status = "approved";
      } else {
        this.leaveRequests[index].status = "rejected";
        this.leaveRequests[index].rejectedLeaveDates =
          this.leaveRequests[index].leaveDates;
        this.leaveRequests[index].leaveDates = [];
      }
      this.leaveRequests[index].approvedOrRejectedBy = data.mentor;
      this.$q.loading.hide();
    },
    async getToMyMenteesLeaveRequests() {
      this.$q.loading.show();
      this.clearFilters();
      const res = await leavesService.fetchMyMenteesLeaveRequests({
        userId: this.$store.getters.userId,
        userType: this.$store.getters.user.userType,
        skip: this.skip,
      });
      this.skip += 200;
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          let data = [];
          element.cancelledLeaveDates.forEach((ele) => {
            data.push(functions.convertDateToDate(ele));
          });
          element.cancelledLeaveDatesArray = data.join(", ");
          data = [];
          element.rejectedLeaveDates.forEach((ele) => {
            data.push(functions.convertDateToDate(ele));
          });
          element.rejectedLeaveDatesArray = data.join(", ");
          this.leaveRequests.push(element);
        });
      }
      this.$store.commit("changeTabName", "Mentees Leave Requests");
      this.$q.loading.hide();
    },
    async getToMyManageesLeaveRequests() {
      this.$q.loading.show();
      this.clearFilters();
      const departments = [];
      this.$store.getters.user.departments.forEach((dept) => {
        departments.push(dept._id);
      });
      const res = await leavesService.fetchMyManageesLeaveRequests({
        departments: departments,
        userId: this.$store.getters.userId,
        mentor: this.$store.getters.mentor,
        skip: this.skip,
      });
      this.skip += 200;
      if (res.data.sheets.data.length > 0) {
        res.data.sheets.data.forEach((element) => {
          this.leaveRequests.push(element);
        });
      }
      this.$store.commit("changeTabName", "Managees Leave Requests");
      this.$q.loading.hide();
      this.$q.loading.hide();
    },
    async routeToGetMyManagees() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "My Managees") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.unSettledLeavesData = [];
        this.unSettledSkip = 0;
        await this.getMyMangeesSettledLeaves();
        await this.getMyMangeesUnSettledLeaves();
      }
    },
    async getMyMangeesSettledLeaves() {
      this.$q.loading.show();
      this.allLeavesData = [];
      const departments = [];
      this.$store.getters.user.departments.forEach((dept) => {
        departments.push(dept._id);
      });
      let res = await leavesService.fetchMyManageesSettledLeaves({
        departments: departments,
        userId: this.$store.getters.userId,
        mentor: this.$store.getters.mentor,
        skip: this.skip,
      });
      this.skip += 200;
      this.allLeavesData = res.data.sheets.data;
      if (this.allLeavesData.length > 0) {
        this.allLeavesData.forEach((mentees) => {
          this.leavesData.push(mentees);
        });
      }

      if (this.leavesData.length > 0) {
        this.$q.loading.show();
        this.settledLeaves = this.leavesData.filter((leaves) => leaves.settled);
      }
      this.$store.commit("changeTabName", "My Managees");
      this.$q.loading.hide();
    },
    async getMyMangeesUnSettledLeaves() {
      this.$q.loading.show();
      this.allLeavesData = [];
      const departments = [];
      this.$store.getters.user.departments.forEach((dept) => {
        departments.push(dept._id);
      });
      let res = await leavesService.fetchMyManageesUnSettledLeaves({
        departments: departments,
        userId: this.$store.getters.userId,
        mentor: this.$store.getters.mentor,
        skip: this.unSettledSkip,
      });
      this.unSettledSkip += 200;
      this.allLeavesData = res.data.sheets.data;
      if (this.allLeavesData.length > 0) {
        this.allLeavesData.forEach((mentees) => {
          this.unSettledLeavesData.findIndex((ld) => ld._id == mentees._id) ==
          -1
            ? this.unSettledLeavesData.push(mentees)
            : "";
        });
      }

      if (this.unSettledLeavesData.length > 0) {
        this.$q.loading.show();
        this.unsettledLeaves = this.unSettledLeavesData.filter(
          (leaves) => !leaves.settled,
        );
      }
      this.$store.commit("changeTabName", "My Managees");
      this.$q.loading.hide();
    },
    async routeToLoadAllLeaves() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "AllLeaves") {
        this.skip = 0;
        this.unSettledSkip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.unSettledLeavesData = [];
        this.prevNameFilterAllLeaves = "";
        this.prevStatusFilter = "";
        await this.loadAllUserSettledLeaves();
        await this.loadAllUserUnsettledLeaves();
      }
    },
    routeToLoadLeaveCardHistory() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "Leave Card") {
        this.skip = 0;
        this.MyLeaveCounts = 0;
        this.leavesData = [];
        this.loadLeaveCardHistory();
        this.getLeaveTypes();
      }
    },
    routeToLoadToLeaveAccruals() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "My Accruals") {
        this.skip = 0;
        this.leaveRequests = [];
        this.loadToMyAccruals();
      }
    },
    routeToLoadToMyLWPs() {
      this.tabChanged = !this.tabChanged;
      this.prevStatusFilter = "";
      if (this.tab == "My LWPs") {
        this.skip = 0;
        this.leaveRequests = [];
        this.settledBySalaryCount = 0;
        this.settledByLeaveBalanceCount = 0;
        this.loadToMyLWPs();
      }
    },
    async routeToLoadAllLWPs() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "All LWPs") {
        this.skip = 0;
        this.leaveRequests = [];
        this.groupByMonth = null;
        await this.loadToAllLWPs();
      }
    },
    routeToLoadToAllAccruals() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "All Accruals") {
        this.skip = 0;
        this.leaveRequests = [];
        this.loadToAllAccruals();
      }
    },
    routeToLoadToUsersLeaveBalance() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "UserLeaveBalance") {
        this.skip = 0;
        this.leavesData = [];
        this.loadToUsersLeaveBalance();
      }
    },
    routeToLoadLeaveRequests() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "Leave Requests") {
        this.skip = 0;
        this.leaveRequests = [];
        this.unSettledLeavesData = [];

        this.shortfallsCountsCal();
        this.loadToLeaveRequestsByUserId();
      }
    },
    async loadToUsersLeaveBalance() {
      this.$q.loading.show();
      const res = await usersService.fetchAllUsersLeaveBalance();
      this.allLeavesData = [];
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.exportBalanceData.push(leaves);
        this.leavesData.push(leaves);
      });
      if (this.searchByUserName != "") {
        this.filterByName2();
      }
      this.$store.commit("changeTabName", "Leave Balance");
      this.$q.loading.hide();
    },
    exportLeaveBalance() {
      // this.$q.loading.show();
      let exportdata = [];
      for (let i = 0; i < this.exportBalanceData.length; i++) {
        exportdata[i] = [];
        exportdata[i][0] = this.exportBalanceData[i].name
          ? this.exportBalanceData[i].name
          : "";
        exportdata[i][1] = this.exportBalanceData[i].grossPlcl
          ? this.exportBalanceData[i].grossPlcl
          : 0;
        exportdata[i][2] = this.exportBalanceData[i].availablePlcl
          ? this.exportBalanceData[i].availablePlcl
          : 0;
        exportdata[i][3] = this.exportBalanceData[i].plclToBeFrozen
          ? this.exportBalanceData[i].plclToBeFrozen
          : 0;
        exportdata[i][4] = this.exportBalanceData[i].frozenPlcl
          ? this.exportBalanceData[i].frozenPlcl
          : 0;
        exportdata[i][5] = this.exportBalanceData[i].compOffs
          ? this.exportBalanceData[i].compOffs
          : 0;
        exportdata[i][6] = this.exportBalanceData[i].bonusLeaves
          ? this.exportBalanceData[i].bonusLeaves
          : 0;
        exportdata[i][7] = this.exportBalanceData[i].optionalLeaves
          ? this.exportBalanceData[i].optionalLeaves
          : 0;
        exportdata[i][8] = this.exportBalanceData[i].settledLwps
          ? this.exportBalanceData[i].settledLwps
          : 0;
        exportdata[i][9] = this.exportBalanceData[i].unsettledLwps
          ? this.exportBalanceData[i].unsettledLwps
          : 0;
        exportdata[i][10] = this.exportBalanceData[i].shortfalls
          ? this.exportBalanceData[i].shortfalls
          : 0;
        exportdata[i][11] = this.exportBalanceData[i].Unsettled
          ? this.exportBalanceData[i].Unsettled
          : 0;
        exportdata[i][12] =
          this.exportBalanceData[i].isEligibleForSpecialLeave &&
          this.exportBalanceData[i].isEligibleForSpecialLeave != "N/A"
            ? "Eligible"
            : "N/A";
      }

      let rows = [
        [
          "S.No",
          " Name               ",
          "Gross PL/CL",
          "Available PL/CL",
          "PL/CL to be Frozen",
          "Frozen PL/CL",
          "CompOff",
          "Bonus",
          "Optional",
          "Settled LWPs",
          "Unsettled LWPs",
          "Shortfalls",
          "Unsettled Leaves ",
          "Eligible for special leave",
        ],
      ];

      for (var i = 0; i < exportdata.length; i++) {
        exportdata[i].unshift(i + 1);
        rows.push(exportdata[i]);
      }
      let csvContent = "data:text/csv;charset=utf-8,";
      rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      const fileName = functions.convertDateToDate(new Date());
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Leave Balance " + fileName + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      this.$q.loading.hide();
    },
    async loadLeaveBalance() {
      this.$q.loading.show();
      const res = await leavesService.fetchAllUserInfo();
      this.userData = [];
      res.data.forEach((user) => {
        this.userData.push({
          id: user._id,
          name: user.firstName + " " + user.lastName,
          balance: user.leaveBalance,
          satCompOff: user.saturdayCompoffBalance,
          sunCompOff: user.sunCompoffLeaveBalance,
          totalBalance:
            Number(user.leaveBalance) +
            Number(user.saturdayCompoffBalance) +
            Number(user.sunCompoffLeaveBalance),
        });
      });
      this.userDataToDisplay = this.userData;
      this.userDataToDisplay2 = this.userDataToDisplay;
      this.layoutTimeSheet = true;
      this.$q.loading.hide();
    },
    routeToLoadLeaveCardAllHistory() {
      this.tabChanged = !this.tabChanged;
      if (this.tab == "All Leave Card") {
        this.loadLeaveCardAllHistory();
        this.getLeaveTypes();
      }
    },
    async loadLeaveCardAllHistory() {
      this.clearFilters();
      this.$q.loading.show();
      const res = await leavesService.fetcAllUsersLeaveCard();
      this.skip += 200;
      this.allLeavesData = [];
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.leavesData.push(leaves);
      });
      this.$q.loading.hide();
    },
    async loadAllUserSettledLeaves() {
      this.$q.loading.show();
      this.clearFilters();
      const res = await leavesService.fetchAllUserSettledLeaves(this.skip);
      this.skip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.leavesData.findIndex((ld) => ld._id == leaves._id) == -1
          ? this.leavesData.push(leaves)
          : "";
      });
      if (this.leavesData.length > 0) {
        this.settledLeaves = this.leavesData.filter((leaves) => leaves.settled);
      }
      this.$store.commit("changeTabName", "All Leaves");
      this.$q.loading.hide();
    },
    async loadAllUserUnsettledLeaves() {
      this.$q.loading.show();
      this.clearFilters();
      const res = await leavesService.fetchAllUserUnsettledLeaves(
        this.unSettledSkip,
      );
      this.unSettledSkip += 200;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.unSettledLeavesData.findIndex((ld) => ld._id == leaves._id) == -1
          ? this.unSettledLeavesData.push(leaves)
          : "";
      });
      if (this.unSettledLeavesData.length > 0) {
        this.unsettledLeaves = this.unSettledLeavesData.filter(
          (leaves) => !leaves.settled,
        );
      }
      this.$store.commit("changeTabName", "All Leaves");
      this.$q.loading.hide();
    },
    async loadToMyAccruals() {
      this.$q.loading.show();
      const res = await leavesService.loadToMyAccruals(
        this.$store.getters.userId,
      );
      this.leaveRequests = [];
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          element.accruedBy.includes("reversal of extra shortfall")
            ? (element.accruedBy = "System(Shortfall Reversal)")
            : "";
          this.leaveRequests.push(element);
        });
      }
      this.$store.commit("changeTabName", "My Accruals");
      this.$q.loading.hide();
    },
    async loadToMyLWPs() {
      this.$q.loading.show();
      let res = await leavesService.fetchMyLwps({
        userId: this.$store.getters.userId,
        skip: this.skip,
      });
      let set = 0;
      let unset = 0;
      let countTempSalarySet = 0;
      let countTempLeaveSet = 0;
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          this.leaveRequests.push(element);
        });
        this.skip += 200;
        if (this.leaveRequests.length > 0) {
          this.leaveRequests.map((leaves) => {
            if (leaves.LwpSettledBy == "leave balance") {
              countTempLeaveSet = countTempLeaveSet + leaves.numberOfLeave;
            } else if (
              leaves.LwpSettledBy == "salary" ||
              leaves.LwpSettledBy == "partial balance"
            ) {
              countTempSalarySet = countTempSalarySet + leaves.numberOfLeave;
            }
            if (leaves.LwpSettled && leaves.accruedAvailedType != "") {
              set = set + leaves.numberOfLeave;
            } else if (!leaves.LwpSettled && leaves.accruedAvailedType == "") {
              unset = unset + leaves.numberOfLeave;
            }
          });
          this.showLwpSettled = set;
          this.showLwpUnsettled = unset;
          this.showLwpBySalary = countTempSalarySet;
          this.showLwpByLeaveBal = countTempLeaveSet;
          this.settledLeaves =
            this.leaveRequests.length > 0
              ? this.leaveRequests.filter(
                  (leaves) =>
                    leaves.LwpSettled && leaves.accruedAvailedType != "",
                )
              : [];
          this.unsettledLeaves =
            this.leaveRequests.length > 0
              ? this.leaveRequests.filter(
                  (leaves) =>
                    !leaves.LwpSettled && leaves.accruedAvailedType == "",
                )
              : [];
        }
      }
      this.$store.commit("changeTabName", "My LWPs");
      this.$q.loading.hide();
    },
    async loadToAllLWPs() {
      this.$q.loading.show();
      this.clearFilters();
      let res = await leavesService.fetchAllLwps({
        skip: this.skip,
      });
      this.skip += 200;
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          if (
            this.leaveRequests.findIndex((data) => data._id == element._id) ==
            -1
          ) {
            this.leaveRequests.push(element);
          }
        });

        if (this.leaveRequests.length > 0) {
          this.settledLeaves = this.leaveRequests.filter(
            (leaves) => leaves.LwpSettled && leaves.accruedAvailedType != "",
          );
          this.unsettledLeaves = this.leaveRequests.filter(
            (leaves) => !leaves.LwpSettled && leaves.accruedAvailedType == "",
          );
        }
        console.log(
          this.leaveRequests,
          this.settledLeaves,
          this.unsettledLeaves,
        );
      }
      this.$store.commit("changeTabName", "All LWPs");
      this.$q.loading.hide();
    },
    async loadToAllAccruals() {
      this.$q.loading.show();
      let res = await leavesService.fetchAllAccruals();
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          element.accruedBy.includes("reversal of extra shortfall")
            ? (element.accruedBy = "System(Shortfall Reversal)")
            : "";
          this.leaveRequests.push(element);
        });
      }
      this.$store.commit("changeTabName", "All Accruals");
      this.$q.loading.hide();
    },
    async loadLeaveBalance() {
      this.$q.loading.show();
      const res = await leavesService.fetchAllUserInfo();
      this.userData = [];
      res.data.forEach((user) => {
        this.userData.push({
          id: user._id,
          name: user.firstName + " " + user.lastName,
          balance: user.leaveBalance,
          satCompOff: user.saturdayCompoffBalance,
          sunCompOff: user.sunCompoffLeaveBalance,
          totalBalance:
            Number(user.leaveBalance) +
            Number(user.saturdayCompoffBalance) +
            Number(user.sunCompoffLeaveBalance),
        });
      });
      this.userDataToDisplay = this.userData;
      this.userDataToDisplay2 = this.userDataToDisplay;
      this.layoutTimeSheet = true;
      this.$q.loading.hide();
    },
    async loadMyProjects() {
      //this.$q.loading.show();
      this.clearFilters();
      //const res = await leavesService.fetchMyProjects(this.$store.getters.userId);
      //this.allLeavesData = [];
      // this.allLeavesData = functions.prepareLeaves(res);
      //this.leavesData = this.allLeavesData;
      // this.$store.commit("changeTabName", 'My Projects');
      // this.$q.loading.hide();
    },
    async loadLeaveCardHistory() {
      this.clearFilters();
      this.$q.loading.show();
      const res = await leavesService.fetchMyLeaveCard(
        this.$store.getters.userId,
        this.skip,
      );
      this.skip += 200;
      this.allLeavesData = [];
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.leavesData.push(leaves);
      });
      this.$store.commit("changeTabName", "History");
      this.$q.loading.hide();
    },
    async getAllLeaveTypes() {
      this.clearFilters();
      this.$q.loading.show();
      this.allLeavesData = [];
      const res = await leavesService.fetchAllLeaveType();
      this.allLeavesData = res.data;
      this.leavesData = this.allLeavesData;
      this.$store.commit("changeTabName", "Leave Type");
      this.$q.loading.hide();
    },
    async getShortfallSheet() {
      this.clearFilters();
      this.$q.loading.show();
      const res = await timsheetService.getShortfallSheet({ skip: this.skip });
      this.skip += res.data.length;
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((ele) => {
        this.leavesData.push(ele);
      });
      this.$store.commit("changeTabName", "Shortfall Sheets");
      this.$q.loading.hide();
    },
    async loadcompoffTimeSheets() {
      try {
        this.$q.loading.show();
        let result = await timsheetService.fetchAllCompoffTimeSheets();
        this.timeSheets = [];
        if (result.data.length > 0) {
          result.data.forEach((timeSheet) => {
            timeSheet.date = new Date(timeSheet.reportDate);
            this.timeSheets = this.addToArrayIfNotExist2(
              this.timeSheets,
              timeSheet,
            );
          });
        }
        this.timeSheetsToDisplay = this.timeSheets;
        this.$store.commit("changeTabName", "Compoff Sheets");
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async loadToBonusLeaveAccrualRecords() {
      try {
        this.$q.loading.show();
        let res = await accrualsService.fetchBonusRuleConfiguration();
        if (res.data.length > 0) {
          this.bonusRuleData = res.data;
          res.data.forEach((data) => {
            data.executionDate = functions.convertUTCToDate(data.executionDate);
            if (data.absentDates) {
              data.absentDates = data.absentDates.map((date) => {
                return (date = functions.convertUTCToDate(date));
              });
            }
            data.presentDates = data.presentDates.map((date) => {
              return (date = functions.convertUTCToDate(date));
            });
          });
        }
        this.$store.commit("changeTabName", "Bonus Accrual Configurations");
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async loadToBonusLeaveApprovalRecords() {
      try {
        this.$q.loading.show();
        let res = await leavesService.fetchBonusLeavesDataForApprovals(
          this.skip,
        );
        if (res.data.length > 0) {
          this.bonusRuleApprovalData = res.data;
        }
        this.skip += 200;
        this.$store.commit("changeTabName", "Bonus Approval Configurations");
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async loadToAccruedConfigRecords() {
      try {
        this.$q.loading.show();
        let res = await accrualsService.fetchAccrualConfigRecords();
        if (res.data.length > 0) {
          this.leavesData = res.data;
        }
        this.$store.commit("changeTabName", "Accrual Configurations");
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async loadLeaveCardAllHistory() {
      this.clearFilters();
      this.$q.loading.show();
      const res = await leavesService.fetcAllUsersLeaveCard(this.skip);
      this.skip += 200;
      this.allLeavesData = [];
      this.allLeavesData = res.data;
      this.allLeavesData.forEach((leaves) => {
        this.leavesData.push(leaves);
      });
      this.$q.loading.hide();
    },
    async onApproveCompoffSheet(value) {
      this.$q.loading.show();
      this.clearFilters();
      let result = await timsheetService.updateCompoffStatus(value);
      this.loadcompoffTimeSheets();
      this.successMsg = "CompOff Status Updated!!";
      this.$q.loading.hide();
    },
    addToArrayIfNotExist2(arr, project) {
      let sheet = [];
      let totalProjectSpentTime = 0;
      let totalActualTime = 0;
      if (project.sheets.length === 0) {
        project.time = 0;
        sheet.push({
          description: "No Data Available.",
          time: 0,
        });
      } else {
        totalActualTime += project.actualHours;
        project.sheets.forEach((elesheet) => {
          totalProjectSpentTime += elesheet.timeSpent;
          sheet.push({
            description: elesheet.description,
            time: elesheet.timeSpent,
          });
        });
      }

      for (let index in arr) {
        if (
          this.convertDate(project.reportDate) ==
            this.convertDate(arr[index].date) &&
          project.user._id == arr[index].user.user_id
        ) {
          arr[index].data.push({
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          });
          return arr;
        }
      }

      arr.push({
        isApproved: project.isApproved,
        isRejected: project.isRejected,
        isAbsent: project.isAbsent,
        oneTimeRejection: project.oneTimeRejection,
        CompoffStatus: project.CompoffStatus,
        date: project.reportDate,
        reportDate: project.reportDate,
        isLapsed: project.isLapsed,
        actualTime: totalActualTime,
        mentor: {
          name: project.mentor
            ? project.mentor.firstName + " " + project.mentor.lastName
            : "NO MENTOR",
        },
        user: {
          user_id: project?.user?._id,
          user_name: project.user
            ? project?.user?.firstName + " " + project?.user?.lastName
            : "NO USER",
        },
        data: [
          {
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          },
        ],
        color:
          project.CompoffStatus == "Approved"
            ? "primary"
            : project.CompoffStatus == "Rejected" || project.isAbsent
            ? "secondary"
            : project.isLapsed && !project.isAbsent
            ? "brown"
            : "warning",
        border:
          project.CompoffStatus == "Approved"
            ? "border-primary"
            : project.CompoffStatus == "Rejected" || project.isAbsent
            ? "border-secondary"
            : project.isLapsed && !project.isAbsent
            ? "border-brown"
            : "border-warning",
        status: project.isApproved
          ? "Approved"
          : project.CompoffStatus == "Pending"
          ? "Approved"
          : project.isRejected
          ? "Rejected"
          : "Pending",
      });
      return arr;
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    filter() {
      this.leavesData = this.allLeavesData;
      this.timeSheetsToDisplay = this.timeSheets;
      this.filterByName();
      this.filterByStatus();
      this.filterByDateRange();
      this.filterByName2();
      this.filterByStatus2();
      this.filterByDateRange2();
      this.filterCompoffByName();
      this.filterCompoffByStatus();
      this.filterCompoffByDateRange();
    },
    filterCompoffByName() {
      if (this.nameFilterForCompoff != null) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) => {
            return timesheet.user.user_name
              .toLowerCase()
              .includes(this.nameFilterForCompoff.toLowerCase());
          },
        );
      }
    },
    filterCompoffByStatus() {
      if (this.statusFilterForCompoff != null) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) => {
            return timesheet.CompoffStatus.toLowerCase().includes(
              this.statusFilterForCompoff.toLowerCase(),
            );
          },
        );
      }
    },
    filterCompoffByDateRange() {
      if (this.dateFilter) {
        let dateObject;
        let dateObject2;
        if (this.dateFilter.to) {
          dateObject = new Date(this.dateFilter.to);
          dateObject.setDate(dateObject.getDate() + 1);
        } else {
          dateObject = new Date(this.dateFilter);
          dateObject2 = new Date(this.dateFilter);
          dateObject2.setDate(dateObject.getDate() + 1);
        }
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) =>
            this.dateFilter.from
              ? moment(timesheet.date).isBetween(
                  this.dateFilter.from,
                  dateObject,
                )
              : moment(timesheet.date).isBetween(dateObject, dateObject2),
        );
      }
    },
    filterByName() {
      if (this.nameFilter) {
        this.leavesData = this.leavesData.filter((leave) => {
          return leave.user.name
            .toLowerCase()
            .includes(this.nameFilter.toLowerCase());
        });
      }
    },
    filterLeaveBalanceByName() {
      if (this.nameFilterLeaveBalance) {
        this.userDataToDisplay = this.userDataToDisplay.filter((user) => {
          return user.name
            .toLowerCase()
            .includes(this.nameFilterLeaveBalance.toLowerCase());
        });
      }
    },
    filterByName2() {
      if (this.nameFilter2) {
        this.leavesData = this.leavesData.filter((leave) => {
          return leave.user.firstname
            .toLowerCase()
            .includes(this.nameFilter2.toLowerCase());
        });
      }
      if (this.searchByUserName) {
        this.leavesData = this.leavesData.filter((leave) => {
          return leave.name
            .toLowerCase()
            .includes(this.searchByUserName.toLowerCase());
        });
        this.exportBalanceData = this.exportBalanceData.filter((leave) => {
          return leave.name
            .toLowerCase()
            .includes(this.searchByUserName.toLowerCase());
        });
      }
    },
    filterByStatus() {
      if (this.statusFilter) {
        this.leavesData = this.leavesData.filter((leave) => {
          return leave.status[this.statusFilter.toLowerCase()] == true;
        });
      }
    },
    filterByStatus2() {
      if (this.statusFilter2) {
        this.leavesData = this.leavesData.filter((leave) => {
          return leave.leaveType.toLowerCase() == this.statusFilter2;
        });
      }
    },
    filterByDateRange() {
      if (this.dateFilter) {
        let dateObject;
        let dateObject2;
        if (this.dateFilter.to) {
          dateObject = new Date(this.dateFilter.from);
          dateObject2 = new Date(this.dateFilter.to);
          dateObject2.setDate(dateObject2.getDate() + 1);
        } else {
          dateObject = new Date(this.dateFilter);
          dateObject2 = new Date(this.dateFilter);
          dateObject2.setDate(dateObject2.getDate() + 1);
        }
        this.leavesData = this.leavesData.filter((leave) =>
          this.dateFilter.from
            ? moment(leave.from).isBetween(dateObject, dateObject2)
            : moment(leave.from).isBetween(dateObject, dateObject2),
        );
      }
    },
    filterByDateRange2() {
      if (this.dateFilter2) {
        let dateObject;
        let dateObject2;
        if (this.dateFilter2.to) {
          dateObject = new Date(this.dateFilter2.from);
          dateObject2 = new Date(this.dateFilter2.to);
          dateObject2.setDate(dateObject2.getDate() + 1);
        } else {
          dateObject = new Date(this.dateFilter2);
          dateObject2 = new Date(this.dateFilter2);
          dateObject2.setDate(dateObject2.getDate() + 1);
        }
        this.leavesData = this.leavesData.filter((leave) =>
          this.dateFilter2.from
            ? moment(leave.date).isBetween(dateObject, dateObject2)
            : moment(leave.date).isBetween(dateObject, dateObject2),
        );
      }
    },
    clearFilters() {
      this.dateFilter = null;
      this.nameFilter = "";
      this.statusFilter = "";
      this.dateFilter2 = null;
      this.nameFilter2 = "";
      this.statusFilter2 = "";
      this.nameFilterAllLeaves = "";
      this.nameFilterLeaveBalance = "";
      this.statusFilterAllLeaves = "";
      this.nameFilterLeaveBalance = "";
      this.dateFilterLeaves = null;
      this.clearFiltersValue = !this.clearFiltersValue;
      this.prevStatusFilter = "";
    },
    async getLeaveTypes() {
      if (this.leaveTypeOptions.length <= 0) {
        this.$q.loading.show();
        this.leaveTypeOptions = [];
        const res = await eventsService.fetchAllLeaveType();
        res.data.forEach((type) => {
          this.leaveTypeOptions.push(type.name);
        });
        this.$q.loading.hide();
      }
    },
    scrolled(val) {
      if (
        this.nameFilterAllLeaves == "" &&
        this.statusFilterAllLeaves == "" &&
        this.dateFilterLeaves == null &&
        !this.settlementByLwps
      ) {
        var elmnt = document.getElementById(val);
        var scrollHeight = elmnt.scrollHeight;
        var divHeight = elmnt.offsetHeight;
        var scrollerEndPoint = scrollHeight - divHeight;
        var divScrollerTop = elmnt.scrollTop;
        if (
          (parseInt(divScrollerTop) === scrollerEndPoint &&
            divScrollerTop > 0) ||
          parseInt(divScrollerTop) + 1 === scrollerEndPoint ||
          parseInt(divScrollerTop) + 2 === scrollerEndPoint
        ) {
          if (this.tab == "AllLeaves") {
            if (val == "AllLeavesUnSettled") {
              this.loadAllUserUnsettledLeaves();
            } else if (val == "AllLeavesSettled") {
              this.loadAllUserSettledLeaves();
            }
          } else if (this.tab == "My Managees") {
            if (val == "myManageesLeavesSettled") {
              this.getMyMangeesSettledLeaves();
            } else if (val == "myManageesLeavesUnSettled") {
              this.getMyMangeesUnSettledLeaves();
            }
          } else if (this.tab == "My Mentees") {
            if (val == "myMenteesLeavesUnSettled") {
              this.getMyMenteesUnsettledLeaves();
            } else if (val == "myMenteesLeavesSettled") {
              this.getMyMenteesSettledLeaves();
            }
          } else if (this.tab == "Mine") {
            if (val == "MineLeavesUnsettled") {
              this.getUserUnsettledLeaves();
            } else if (val == "MineLeavesSettled") {
              this.getUserSettledLeaves();
            }
          } else if (this.tab == "Leave Requests") {
            this.loadToLeaveRequestsByUserId();
          } else if (this.tab == "Mentees Leave Requests") {
            this.getToMyMenteesLeaveRequests();
          } else if (this.tab == "Managees Leave Requests") {
            this.getToMyManageesLeaveRequests();
          } else if (val == "LeaveBalance") {
            this.loadLeaveBalance();
          } else if (this.tab == "shortfallSheet") {
            this.getShortfallSheet();
          } else if (this.tab == "AllLeaveRequests") {
            this.loadToAllLeaveRequest();
          }
        }
      }
    },
    getLeaveBalanceByFilter() {
      this.userDataToDisplay = this.userDataToDisplay2;
      this.filterLeaveBalanceByName();
    },
    async getLeavesByFilter() {
      this.prevNameFilterAllLeaves = this.nameFilterAllLeaves;
      this.prevStatusFilter = this.statusFilterAllLeaves;
      this.$q.loading.show();
      if (
        !this.nameFilterAllLeaves &&
        (!this.statusFilterAllLeaves || this.statusFilterAllLeaves == null) &&
        this.dateFilterLeaves == null &&
        !this.settlementByLwps &&
        !this.filterByMonth
      ) {
        this.leavesData = [];
        this.unSettledLeavesData = [];
        this.leaveRequests = [];
        this.skip = 0;
        this.unSettledSkip = 0;
        if (this.tab == "Leave Requests") {
          this.loadToLeaveRequestsByUserId();
        } else if (this.tab == "Mentees Leave Requests") {
          this.getToMyMenteesLeaveRequests();
        } else if (this.tab == "Managees Leave Requests") {
          this.getToMyManageesLeaveRequests();
        } else if (this.tab == "AllLeaveRequests") {
          this.loadToAllLeaveRequest();
        } else if (this.tab == "AllLeaves") {
          await this.loadAllUserSettledLeaves();
          await this.loadAllUserUnsettledLeaves();
        } else if (this.tab == "My Managees") {
          await this.getMyMangeesSettledLeaves();
          await this.getMyMangeesUnSettledLeaves();
        } else if (this.tab == "My Mentees") {
          await this.getMyMenteesSettledLeaves();
          await this.getMyMenteesUnsettledLeaves();
        } else if (this.tab == "Mine") {
          await this.getUserSettledLeaves();
          await this.getUserUnsettledLeaves();
        } else if (this.tab == "My LWPs") {
          this.prevStatusFilter = "";
          this.loadToMyLWPs();
        } else if (this.tab == "All LWPs") {
          this.loadToAllLWPs();
        } else if (this.tab == "My Accruals") {
          this.loadToMyAccruals();
        } else if (this.tab == "All Accruals") {
          this.loadToAllAccruals();
        } else if (this.tab == "Leave Card") {
          this.loadLeaveCardHistory();
          this.getLeaveTypes();
        } else if (this.tab == "All Leave Card") {
          this.loadLeaveCardAllHistory();
          this.getLeaveTypes();
        } else if (this.tab == "shortfallSheet") {
          this.getShortfallSheet();
        } else if (this.tab == "compoffSheets") {
          this.loadcompoffTimeSheets();
        } else if (this.tab == "All Leave Card") {
          this.loadLeaveCardAllHistory();
          this.getLeaveTypes();
        }
        this.clearFilters();
      } else {
        if (!this.nameFilterAllLeaves && this.dateFilterLeaves) {
          var from = this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "";
          var to = this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "";
          this.apiForAllSheetFilter();
        } else {
          this.apiForAllSheetFilter();
        }
      }
    },
    async apiForAllSheetFilter() {
      var res = [];
      var elmntId = "";
      if (this.tab == "Leave Requests") {
        elmntId = "leaveRequests";
        res = await leavesService.fetchMyLeaveRequestsByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "Mentees Leave Requests") {
        elmntId = "menteesLeaveRequests";
        res = await leavesService.fetchAllLeaveRequestsByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
          userType: this.$store.getters.user.userType,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "Managees Leave Requests") {
        const departments = [];
        this.$store.getters.user.departments.forEach((dept) => {
          departments.push(dept._id);
        });
        elmntId = "manageesLeaveRequests";
        res = await leavesService.fetchManageesLeaveRequestsByFilter({
          departments: departments,
          userId: this.$store.getters.userId,
          mentor: this.$store.getters.mentor,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "AllLeaveRequests") {
        elmntId = "AllLeaveRequests";
        res = await leavesService.fetchAllLeaveRequestsByFilter({
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
          userType: this.$store.getters.user.userType,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "Mine") {
        elmntId = "MineLeaves";
        res = await leavesService.fetchMyLeavesByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
      } else if (this.tab == "My Mentees") {
        elmntId = "My Mentees";
        res = await leavesService.fetchAllLeavesByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
          tabName: "My Mentees",
        });
      } else if (this.tab == "My Managees") {
        const departments = [];
        this.$store.getters.user.departments.forEach((dept) => {
          departments.push(dept._id);
        });
        elmntId = "My Managees";
        res = await leavesService.fetchManageesLeavesByFilter({
          departments: departments,
          userId: this.$store.getters.userId,
          mentor: this.$store.getters.mentor,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
      } else if (this.tab == "AllLeaves") {
        elmntId = "AllLeaves";
        res = await leavesService.fetchAllLeavesByFilter({
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
      } else if (this.tab == "All LWPs") {
        elmntId = "LWPUnsattled";
        res = await leavesService.fetchAllLwpsByFilter({
          name: this.nameFilterAllLeaves,
          month: this.filterByMonth,
        });
      } else if (this.tab == "My LWPs") {
        elmntId = "LWPUnsattled";
        res = await leavesService.fetchMyLwpsByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.settlementByLwps,
        });
      } else if (this.tab == "My Accruals") {
        elmntId = "myAccruals";
        res = await leavesService.fetchMyAccrualsByFilter({
          userId: this.$store.getters.userId,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "All Accruals") {
        elmntId = "allAccruals";
        res = await leavesService.fetchAllAccrualsByFilter({
          userId: this.$store.getters.userId,
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          status: this.statusFilterAllLeaves,
        });
        this.leaveRequests = res.data;
      } else if (this.tab == "shortfallSheet") {
        elmntId = "ShortFallSheet";
        res = await timsheetService.fetchAllShortFallSheetByFilter({
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
        });
      } else if (this.tab == "compoffSheets") {
        elmntId = "CompoffTimesheetId";
        var result = await timsheetService.fetchAllCompoffTimeSheetsFilter({
          name: this.nameFilterAllLeaves,
          fromDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.from
              ? functions.convertDateToUTC(this.dateFilterLeaves.from)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          toDate: this.dateFilterLeaves
            ? this.dateFilterLeaves.to
              ? functions.convertDateToUTC(this.dateFilterLeaves.to)
              : functions.convertDateToUTC(this.dateFilterLeaves)
            : "",
          CompoffStatus: this.statusFilterAllLeaves,
        });
        this.timeSheets = [];
        result.data.forEach((timeSheet) => {
          timeSheet.date = new Date(timeSheet.reportDate);
          this.timeSheets = this.addToArrayIfNotExist2(
            this.timeSheets,
            timeSheet,
          );
        });
        this.timeSheetsToDisplay = this.timeSheets;
        this.$q.loading.hide();
      }

      this.allLeavesData = [];
      if (this.tab == "shortfallSheet") {
        this.allLeavesData = res.data;
        this.leavesData = this.allLeavesData;
      } else {
        if (res.data == "limit exceed") {
          this.$q.loading.hide();
          this.errorMsg = "Records Limit Exceed, Try applying more filters.";
          this.errorLayout = true;
        } else {
          if (
            this.tab == "AllLeaves" ||
            this.tab == "All LWPs" ||
            this.tab == "My LWPs" ||
            this.tab == "Mine" ||
            this.tab == "My Managees" ||
            this.tab == "My Mentees"
          ) {
            if (
              this.tab == "Mine" ||
              this.tab == "My Managees" ||
              this.tab == "My Mentees" ||
              this.tab == "AllLeaves"
            ) {
              this.leavesData = res.data;
              this.settledLeaves =
                this.leavesData.length > 0
                  ? this.leavesData.filter((leaves) => leaves.settled)
                  : [];
              this.unsettledLeaves =
                this.leavesData.length > 0
                  ? this.leavesData.filter((leaves) => !leaves.settled)
                  : [];
            } else if (this.tab == "All LWPs") {
              this.leaveRequests = res.data;
              this.settledLeaves =
                this.leaveRequests.settledLwp.filter(
                  (leaves) =>
                    leaves.LwpSettled && leaves.accruedAvailedType != "",
                ) ?? [];
              this.unsettledLeaves =
                this.leaveRequests.unsettledLwp.filter(
                  (leaves) =>
                    !leaves.LwpSettled && leaves.accruedAvailedType == "",
                ) ?? [];
            } else {
              this.leaveRequests = res.data;
              this.settledLeaves =
                this.leaveRequests?.filter(
                  (leaves) =>
                    leaves.LwpSettled && leaves.accruedAvailedType != "",
                ) ?? [];
              this.unsettledLeaves =
                this.leaveRequests.filter(
                  (leaves) =>
                    !leaves.LwpSettled && leaves.accruedAvailedType == "",
                ) ?? [];
            }
          }
          // this.allLeavesData = functions.prepareLeaves(res);
          // this.leavesData = res.data;
        }
      }
      // var elmnt = document.getElementById(elmntId)
      // elmnt.scrollTop = 0;
      this.$q.loading.hide();
    },
    onEditLeaveType(value) {
      this.editLeaveType = true;
      this.setDataForEdit = true;
      this.leaveTypeData = value;
    },
    onCloseAddLeaveType() {
      this.editLeaveType = false;
      this.setDataForEdit = false;
      this.getAllLeaveTypes();
    },
    updateProxy() {
      this.proxyDate = null;
      this.exportDate = null;
    },
    saveExport() {
      this.exportDate = this.proxyDate;
      this.exportLeaves();
    },
    async exportLeaves() {
      this.$q.loading.show();
      const date = {
        from: this.proxyDate.from
          ? functions.convertDateToUTC(this.proxyDate.from)
          : functions.convertDateToUTC(this.proxyDate),
        to: this.proxyDate.to
          ? functions.convertDateToUTC(this.proxyDate.to)
          : functions.convertDateToUTC(this.proxyDate),
      };
      const dateToDisplay = this.proxyDate.from
        ? functions.convertDateToDate(date.from) +
          " To " +
          functions.convertDateToDate(date.to)
        : functions.convertDateToDate(date.from);
      const fileName = this.proxyDate.from
        ? "LeaveReport_" +
          functions.convertDateToDate(date.from).split(" ")[1] +
          functions.convertDateToDate(date.from).split(" ")[2] +
          "-" +
          functions.convertDateToDate(date.to).split(" ")[1] +
          functions.convertDateToDate(date.to).split(" ")[2]
        : "LeaveReport_" +
          functions.convertDateToDate(date.from).split(" ")[1] +
          functions.convertDateToDate(date.from).split(" ")[2];
      const res = await leavesService.getLeavesDataToExport(date);
      var rows = [
        [dateToDisplay],
        [
          "",
          "",
          "Opening Balance",
          "",
          "",
          "",
          "",
          "",
          "Leave Accrued",
          "",
          "",
          "",
          "",
          "Leaves Granted",
          "",
          "",
          "",
          "",
          "",
          "Closing Balance",
          "",
          "",
          "",
          "",
          "",
          "                 ",
          "Availed Special Leaves",
        ],
        [
          "S.No.",
          "Name",
          "PL/CL",
          "Comp-Off",
          "Bonus",
          "Optional",
          "LWP Availed",
          "Total",
          "PL/CL",
          "Comp-Off",
          "Bonus",
          "Optional",
          "Total",
          "PL/CL",
          "Comp-Off",
          "Bonus",
          "Optional",
          "LWP Availed",
          "Total",
          "PL/CL",
          "Comp-Off",
          "Bonus",
          "Optional",
          "LWP Availed",
          "Total",
          "              ",
          "",
        ],
      ];

      for (var i = 0; i < res.data.length; i++) {
        res.data[i].unshift(i + 1);
        rows.push(res.data[i]);
      }
      let csvContent = "data:text/csv;charset=utf-8,";
      rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName + ".csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      this.$q.loading.hide();
    },
    async getMyMenteesCount() {
      this.$q.loading.show();
      let res = await leavesService.fetchMenteesCountByLeaveRequests(
        this.$store.getters.userId,
      );
      this.isBelongsToMyMentees = res.data.length > 0;
      this.$q.loading.hide();
    },
  },
  async mounted() {
    // this.checkingMethod();
    await this.getHolidays();
    this.getMyMenteesCount();
    // this.routeToLoadLeaveRequests();
    this.redirectToLeaveRequests();
  },
};
</script>

<style scoped>
.session_year {
  text-align: center;
  font-size: 16px;
  font-family: inherit;
  color: #93be3b;
  height: 40px;
  /* padding: 10px 0px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.hide-separator {
  width: 0px !important;
}

.leave-separator {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}
.heightSet {
  /* height: 50vh !important; */
}
</style>
<style>
.timesheet_tabs .q-tabs__arrow {
  display: none;
}
.timesheet_tabs .q-tabs__content {
  height: 80vh !important;
  overflow-y: auto;
}
.q-expansion-item .q-tab__label {
  font-size: 12px !important;
}
.max_width_120_px {
  min-width: 120px !important;
}
</style>
