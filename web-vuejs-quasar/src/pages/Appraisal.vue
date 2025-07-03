<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="window-height appraisal_tab_width appraisal-yahin-par"
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
              data-id="appraisal-self"
            >
              <q-tab
                name="Mine"
                icon="assignment_ind"
                label="Self"
                @click="routeToLoadMyAppraisal"
                data-id="self-selfappraisal"
              />
              <q-tab
                @click="routeToLoadLastConclusion"
                name="lastConclusion"
                icon="360"
                label="My 360°"
                data-id="self-my360"
              />
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              label="Mentor/Manager"
              v-if="
                $store.getters.userType != 'user' &&
                $store.getters.user.isLead == true
              "
              data-id="appraisal-mentor-manager"
            >
              <q-tab
                name="Lead"
                icon="speaker_notes"
                label="Lead"
                @click="routeToLoadLeadAppraisal"
                v-if="
                  $store.getters.userType != 'user' &&
                  $store.getters.user.isLead == true
                "
                data-id="appraisal-lead"
              />
              <q-tab
                name="Reviewer"
                icon="checklist_rtl"
                label="Reviewer"
                @click="routeToLoadReviewerAppraisal"
                v-if="
                  $store.getters.userType == 'manager' ||
                  $store.getters.userType == 'admin' ||
                  isReviewer ||
                  $store.getters.user.isLead == true
                "
                data-id="appraisal-reviewer"
              />
              <q-tab
                @click="routeToLoadAppraisalConclusionByMantor"
                name="AllConclusion"
                icon="360"
                label="Mentees 360°"
                v-if="isBelongsToConclusionHerarchy"
                data-id="appraisal-mentees360"
              />
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              label="Admin"
              v-if="$store.getters.userType == 'admin'"
              data-id="appraisal-admin"
            >
              <q-tab
                name="Current"
                icon="person_pin"
                label="Current Appraisal"
                @click="routeToLoadCurrentAppraisals"
                v-if="$store.getters.userType == 'admin'"
                data-id="current-appraisal"
              />
              <q-tab
                name="All"
                icon="person_pin"
                label="All Appraisal"
                @click="routeToLoadAllAppraisals"
                v-if="$store.getters.userType == 'admin'"
                data-id="all-appraisal"
              />
              <q-tab
                @click="routeToLoad360Appraisal"
                name="360Appraisals"
                icon="person_pin"
                label="Current 360"
                v-if="$store.getters.userType == 'admin'"
                data-id="current-360"
              />
              <q-tab
                @click="routeToLoadAll360Appraisals"
                name="All360Appraisals"
                icon="person_pin"
                label="All 360"
                v-if="$store.getters.userType == 'admin'"
                data-id="all-360"
              />
              <q-tab
                @click="routeToLoadAppraisalConclusion"
                name="ApprConclusion"
                icon="history_edu"
                label="Conclusion History"
                v-if="$store.getters.userType == 'admin'"
                data-id="conclusion-history"
              />
              <q-tab
                @click="routeToLoadSelfForm"
                name="SelfForm"
                icon="dynamic_form"
                label="Self Form"
                v-if="$store.getters.userType == 'admin'"
                data-id="self-form"
              />
              <q-tab
                @click="routeToLoadLeadForm"
                name="LeadForm"
                icon="dynamic_form"
                label="Lead Form"
                v-if="$store.getters.userType == 'admin'"
                data-id="lead-form"
              />
              <q-tab
                @click="routeToLoadRatings"
                name="Ratings"
                icon="dynamic_form"
                label="Ratings"
                v-if="$store.getters.userType == 'admin'"
                data-id="ratings"
              />
              <q-tab
                @click="routeToLoadContributions"
                name="Contributions"
                icon="dynamic_form"
                label="Contributions"
                v-if="$store.getters.userType == 'admin'"
                data-id="contributions"
              />
              <q-tab
                @click="routesToLoad360Categories"
                name="360Categories"
                icon="dynamic_form"
                label="360 Categories"
                v-if="$store.getters.userType == 'admin'"
                data-id="360-category"
              />
            </q-expansion-item>
          </q-list>
        </q-tabs>
      </template>

      <!-- right side main content area -->
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          v-touch-swipe="handler"
          transition-prev="jump-up"
          transition-next="jump-up"
          style="position: relative; bottom: 5px"
        >
          <q-tab-panel name="Mine">
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
              style="margin-top: 45px"
            >
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter = null"
                data-id="self-searchbymonth"
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
                    v-model="monthFilter"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="self-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="calendar-ok"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li v-for="(data, index) in denoteColors" :key="index">
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
            >
              <SelfAppraisalCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAppraisal="reloadAppraisals"
                data-id="appraisal-card"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Lead">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div
                class="justify-between full-width"
                style="display: inline-flex; position: relative; bottom: 10px"
              >
                <q-btn
                  flat
                  label="Show More"
                  color="primary"
                  @click="getOneMoreAppraisalRecords"
                  class="q-ml-auto"
                  :disabled="showMore"
                  data-id="lead-showmorebutton"
                />
              </div>
              <q-input
                outlined
                v-model="nameFilter"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="lead-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter = null"
                data-id="lead-searchbymonth"
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
                    v-model="monthFilter"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="lead-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="leadcalendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li v-for="(data, index) in denoteColorsForLead" :key="index">
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
            >
              <LeadAppraisalCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAppraisal="reloadAppraisals"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Reviewer">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div
                class="justify-between full-width"
                style="display: inline-flex; position: relative; bottom: 10px"
              >
                <q-btn
                  flat
                  label="Show More"
                  color="primary"
                  @click="getOneMoreAppraisalRecords"
                  class="q-ml-auto"
                  :disabled="showMore"
                  data-id="reviewer-showmorebutton"
                />
              </div>
              <q-input
                outlined
                v-model="nameFilter"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="reviewer-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter = null"
                data-id="reviewer-searchbymonth"
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
                    v-model="monthFilter"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="reviewer-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="reviewercalendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li v-for="(data, index) in denoteColorsForLead" :key="index">
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
            >
              <LeadAppraisalCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAppraisal="reloadAppraisals"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Current">
            <div
              class="justify-between full-width"
              style="display: inline-flex; position: relative; bottom: 10px"
            >
              <q-btn
                flat
                label="Show More"
                color="primary"
                @click="getOneMoreAppraisalRecords('Current')"
                class="q-ml-auto"
                :disabled="showMore"
                data-id="currentappraisal-showmorebutton"
              />
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilter"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="currentappraisal-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter"
                :options="filteredStatus"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="currentappraisal-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>

              <q-input
                outlined
                v-model="monthFilterConverted"
                class="q-px-sm col-4"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter = null"
                data-id="currentappraisal-searchbymonth"
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
                    v-model="monthFilter"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="currentappraisal-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        class="custom-btn"
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="currentappraisalcalendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li
                  v-for="(data, index) in denoteColorsForCurrent"
                  :key="index"
                >
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
              @scroll="scrolled()"
            >
              <CurrentAppraisal
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisalData="appraisal"
                :tab="tab"
                @reloadAppraisal="reloadAppraisals"
                @routeToLoadCurrentAndAll360="
                  routeToLoad360AppraisalsOnIconClick
                "
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="All">
            <div
              class="justify-between full-width"
              style="display: inline-flex; position: relative; bottom: 10px"
            >
              <q-btn
                flat
                label="Show More"
                color="primary"
                @click="getOneMoreAppraisalRecords('All')"
                class="q-ml-auto"
                :disabled="showMore"
                data-id="allappraisal-showmorebutton"
              />
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilter"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="allappraisal-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter"
                :options="filteredStatus"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="allappraisal-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter = null"
                data-id="allappraisal-searchbymonth"
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
                    v-model="monthFilter"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="allappraisal-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="allappraisalcalendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li v-for="(data, index) in denoteColorsForAll" :key="index">
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
            >
              <CurrentAppraisal
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisalData="appraisal"
                :tab="tab"
                @reloadAppraisal="reloadAppraisals"
                @routeToLoadCurrentAndAll360="
                  routeToLoad360AppraisalsOnIconClick
                "
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="360Appraisals">
            <q-splitter v-model="splitterModel" class="full-width">
              <template v-slot:before class="categories-window">
                <div class="q-mb-md justify-between full-width">
                  <div
                    class="text-primary text-weight-medium text-center non-selectable text-capitalize q-mb-md"
                    style="
                      font-size: 16px;
                      text-transform: capitalize;
                      color: rgb(0, 0, 0) !important;
                      letter-spacing: 0.005em;
                    "
                    data
                    id="360cards-heading"
                  >
                    360 cards
                  </div>
                  <div
                    class="denote_color q-mt-sm"
                    style="margin-bottom: -12px"
                  >
                    <ul>
                      <li
                        v-for="(data, index) in denoteColorsForCurrent"
                        :key="index"
                      >
                        <span
                          class="color_dot"
                          :style="{ backgroundColor: data.color }"
                        ></span>
                        <span>
                          {{ data.text == "Due" ? "Not Started" : data.text }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  style="padding-left: 8px"
                  class="card-container row wrap justify-start items-start content-start full-widt q-mt-md"
                >
                  <Appraisal360Card
                    v-for="(appraisal, index) in appraisalsToDisplay"
                    :key="index"
                    :userAppraisalData="appraisal"
                    :tab="tab"
                    @reloadAppraisal="routeToLoad360Appraisal"
                    :isParticipant="false"
                    @loadParticipants="loadAllParticipantsBy360Card"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div class="q-mb-md justify-between full-width">
                  <div
                    v-if="appraisal360Data.user"
                    class="text-primary text-weight-medium text-center non-selectable text-capitalize q-mb-md"
                    style="
                      font-size: 16px;
                      color: rgb(0, 0, 0) !important;
                      letter-spacing: 0.005em;
                    "
                    data
                    id="360participants-heading"
                  >
                    {{
                      appraisal360Data.user.firstName +
                      " " +
                      appraisal360Data.user.lastName +
                      "'s 360 Participants"
                    }}
                  </div>
                  <q-btn
                    flat
                    label="Add participants"
                    color="primary"
                    @click="openParticipantsFormDialog"
                    class="q-ml-auto float-right text-capitalize"
                    :disabled="!appraisal360Data.user"
                    style="margin-top: -15px"
                    data
                    id="360participants-addparticipantsbutton"
                  />
                  <div
                    class="denote_color q-mt-sm"
                    style="margin-bottom: -12px"
                  >
                    <ul>
                      <li>
                        <span
                          class="color_dot"
                          :style="{ backgroundColor: '#F2C037' }"
                        ></span>
                        <span class="text-capitalize"> In progress </span>
                      </li>
                      <li>
                        <span
                          class="color_dot"
                          :style="{ backgroundColor: '#93BE3B' }"
                        ></span>
                        <span> Done </span>
                      </li>
                    </ul>
                  </div>
                  <Add360Participants
                    :model="openAddParticipantForm"
                    :userInitiate360Data="appraisal360Data"
                    :userClientProjectData="clientProjectData"
                    @updatedInitiate360Data="refreshInitiate360CardData"
                    :isUpdateRequest="true"
                    @close="closeParticipantsForm"
                  />
                </div>
                <div
                  class="card-container row wrap justify-start items-start content-start full-width"
                  :style="[
                    participants?.length > 6
                      ? { 'padding-left': '12px', 'padding-right': '12px' }
                      : { 'padding-left': '30px' },
                  ]"
                >
                  <Appraisal360Card
                    v-for="(participant, index) in participants"
                    :key="index"
                    :participant="participant"
                    :userInitiate360Data="appraisal360Data"
                    :tab="tab"
                    @reloadAppraisal="update360CardOnSubmit"
                    :isParticipant="true"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>
          <q-tab-panel name="All360Appraisals">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            ></div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <Appraisal360Card
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :userAppraisalData="appraisal"
                :tab="tab"
                @reloadAppraisal="routeToLoad360Appraisal"
                :isAll360Card="true"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="SelfForm">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Question"
                color="primary"
                @click="addFormCardLayout = true"
                class="q-ml-auto"
                data-id="selfform-addquestionbutton"
              />
              <AddFormCard
                :layout="addFormCardLayout"
                @close="addFormCardLayout = false"
                :type="'self'"
                @refreshAnnoucements="routeToLoadSelfForm"
              />
            </div>
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
            ></div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadSelfForm"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="LeadForm">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Question"
                color="primary"
                @click="addFormCardLayout = true"
                class="q-ml-auto"
                data-id="leadform-addquestionbutton"
              />
              <AddFormCard
                :layout="addFormCardLayout"
                @close="addFormCardLayout = false"
                :type="'lead'"
                @refreshAnnoucements="routeToLoadLeadForm"
              />
            </div>
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
            ></div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadLeadForm"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Ratings">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Ratings"
                color="primary"
                @click="addFormCardLayout = true"
                class="q-ml-auto"
                data-id="ratings-addratingsbutton"
              />
              <AddFormCard
                :layout="addFormCardLayout"
                @close="addFormCardLayout = false"
                :type="'ratings'"
                @refreshAnnoucements="routeToLoadRatings"
              />
            </div>
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
            ></div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadRatings"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="ApprConclusion">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div
                class="justify-between full-width"
                style="display: inline-flex; position: relative; bottom: 10px"
              >
                <q-btn
                  flat
                  label="Show More"
                  color="primary"
                  @click="getOneMoreAppraisalRecords"
                  class="q-ml-auto"
                  :disabled="showMore"
                  data-id="conclusionhistory-showmorebbutton"
                />
              </div>
              <q-input
                outlined
                v-model="nameFilter2"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter2()"
                dense
                data-id="conclusionhistory-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter2"
                :options="['due', 'InProgress', 'Completed']"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter2()"
                dense
                data-id="conclusionhistory-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>

              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted2"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter2 = null"
                data-id="conclusionhistory-searchbymonth"
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
                    v-model="monthFilter2"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="conclusionhistory-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="conclusionhistorycalendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li
                  v-for="(data, index) in denoteColorsForConclusions"
                  :key="index"
                >
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
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadAppraisalConclusion"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="AllConclusion">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div
                class="justify-between full-width"
                style="display: inline-flex; position: relative; bottom: 15px"
              >
                <q-btn
                  flat
                  label="Show More"
                  color="primary"
                  @click="getOneMoreAppraisalRecords"
                  class="q-ml-auto"
                  :disabled="showMore"
                  data-id="mentees360-showmorebutton"
                />
              </div>
              <q-input
                outlined
                v-model="nameFilter2"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter2()"
                dense
                data-id="mentees360-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>

              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter2"
                :options="['due', 'InProgress', 'Completed']"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter2()"
                dense
                data-id="mentees360-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>

              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted2"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter2 = null"
                data-id="mentees360-searchbymonth"
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
                    v-model="monthFilter2"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="mentees360-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="mentees360calendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="denote_color q-mt-sm">
              <ul>
                <li
                  v-for="(data, index) in denoteColorsForConclusions"
                  :key="index"
                >
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
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadAppraisalConclusionByMantor"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="lastConclusion">
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
              style="margin-top: 45px"
            >
              <!-- <div class="q-mb-md justify-between full-width" style="display: inline-flex">
                  <q-btn
                    flat
                    label="Show More"
                    color="primary"
                    @click="getOneMoreAppraisalRecords"
                    class="q-ml-auto"
                    :disabled="showMore"
                  />
               </div> -->
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="monthFilterConverted2"
                label="Search by Month"
                lazy-rules
                dense
                clearable
                @clear="monthFilter2 = null"
                data-id="my360-searchbymonth"
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
                    v-model="monthFilter2"
                    years-in-month-view
                    default-view="Months"
                    emit-immediately
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    minimal
                    mask="MMM YY"
                    class="myDate"
                    data-id="my360-calendar"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="my360calendar-okbutton"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadLastConclusion"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="Contributions">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Contributions"
                color="primary"
                @click="addFormCardLayout = true"
                class="q-ml-auto"
                data-id="contributions-addcontributionsbutton"
              />
              <AddFormCard
                :layout="addFormCardLayout"
                @close="addFormCardLayout = false"
                :type="'contributions'"
                @refreshAnnoucements="routeToLoadContributions"
              />
            </div>
            <div
              class="q-mt-lg fit row wrap justify-start items-start content-start full-width"
            ></div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <FormCard
                v-for="(appraisal, index) in appraisalsToDisplay"
                :key="index"
                :appraisal="appraisal"
                @refreshAnnoucements="routeToLoadContributions"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="360Categories">
            <q-splitter v-model="splitterModel" class="full-width">
              <template v-slot:before class="categories-window">
                <div class="q-mb-md justify-between full-width">
                  <div
                    class="text-primary text-weight-medium text-center non-selectable"
                    style="
                      font-size: 16px;
                      text-transform: capitalize;
                      color: rgb(0, 0, 0) !important;
                      letter-spacing: 0.005em;
                    "
                  >
                    Assessment Categories
                  </div>
                  <q-btn
                    flat
                    label="Add Category"
                    color="primary"
                    @click="openAddCategoryDialog"
                    class="q-ml-auto float-right"
                    data-id="360categories-addcategorybutton"
                  />
                  <AddOrUpdateCategoryAndParameterCard
                    :layoutValue="addCategoryCardLayout"
                    @close="closeCategoryForm"
                    :isCategoryForm="true"
                    :isParameterForm="isParameterForm"
                    @refreshAnnoucements="updateCategoryList"
                  />
                </div>

                <div
                  class="card-container row wrap justify-start items-start content-start full-width"
                  id="card-container"
                  style="padding-left: 35px"
                >
                  <CategoryFormCard
                    v-for="(category, index) in categories"
                    :key="index"
                    :category="category"
                    @refreshAnnoucements="updateCategoryList"
                    @setDataForEdit="changeDataForEdit"
                    @loadParameter="loadAllParameterByCategoryId"
                    :isCategoryCard="true"
                  />
                </div>
              </template>
              <template v-slot:after>
                <div class="q-mb-md justify-between full-width">
                  <div
                    v-if="category.name"
                    class="text-primary text-weight-medium text-center non-selectable"
                    style="
                      font-size: 16px;
                      color: rgb(0, 0, 0) !important;
                      letter-spacing: 0.005em;
                    "
                  >
                    {{
                      category.name[0].toUpperCase() +
                      category.name.slice(1) +
                      "'s Parameters"
                    }}
                  </div>
                  <q-btn
                    flat
                    label="Add Parameter"
                    color="primary"
                    @click="openParameterFormDialog()"
                    class="q-ml-auto float-right"
                    :disabled="!category.name"
                    data-id="360categories-addparameterbutton"
                  />
                  <AddOrUpdateCategoryAndParameterCard
                    :layoutValue="addCategoryCardLayout"
                    :isParameterForm="isParameterForm"
                    :category="category"
                    @close="closeCategoryForm"
                    @refreshAnnoucements="updateParameterList"
                  />
                </div>
                <div
                  class="card-container row wrap justify-start items-start content-start full-width"
                  :style="[
                    categoryParameterList?.length > 4
                      ? { 'padding-left': '45px' }
                      : { 'padding-left': '57px' },
                  ]"
                >
                  <CategoryFormCard
                    v-for="(parameter, index) in categoryParameterList"
                    :key="index"
                    :parameter="parameter"
                    @setDataForEdit="changeDataForEdit"
                    :isParameterCard="true"
                    :category="category"
                    @refreshAnnoucements="updateParameterList"
                  />
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import Notify from "../components/Notify.vue";
import * as appraisalService from "../services/appraisals.service";
import * as flow_levelService from "../services/flow_level.service";
import * as category360Service from "../services/360Categories.service";
import * as appraisal360Service from "../services/360Appraisals.service";
import * as projectClientService from "../services/projects.service";
import FormCard from "../components/Appraisal/FormCard.vue";
import AddFormCard from "../components/Appraisal/AddUpdateFormCard.vue";
import CurrentAppraisal from "../components/Appraisal/CurrentAppraisal.vue";
import SelfAppraisalCard from "../components/Appraisal/SelfAppraisalCard.vue";
import LeadAppraisalCard from "../components/Appraisal/LeadAppraisalCard.vue";
import AddOrUpdateCategoryAndParameterCard from "../components/Appraisal/AddOrUpdateCategoryAndParameterCard.vue";
import CategoryFormCard from "src/components/Appraisal/CategoryFormCard.vue";
import Appraisal360Card from "../components/Appraisal/360AppraisalAndParticipantCard.vue";
import Add360Participants from "src/components/Appraisal/Add360Participants.vue";
import {
  FeedbackStatus,
  Current360Status,
} from "../constants/feedbackConstants";
import moment from "moment";
import { ref, onUpdated } from "vue";

export default {
  components: {
    Notify,
    FormCard,
    AddFormCard,
    CurrentAppraisal,
    SelfAppraisalCard,
    LeadAppraisalCard,
    AddOrUpdateCategoryAndParameterCard,
    CategoryFormCard,
    Appraisal360Card,
    Add360Participants,
  },
  created() {},
  data() {
    return {
      filtereDataForCurrent360Appraisal: null,
      categoryParameterList: [],
      isParameterForm: false,
      tab: "Mine",
      step: 1,
      splitterModel: "",
      appraisals: [],
      appraisalsToDisplay: [],
      addFormCardLayout: false,
      nameFilter: "",
      statusFilter: "",
      monthFilter: null,
      denoteColors: [
        { text: "Submitted", color: "#93BE3B" },
        { text: "Submission Pending", color: "#F2C037" },
      ],
      denoteColorsForLead: [
        { text: "Submitted", color: "#93BE3B" },
        { text: "Pending", color: "#F2C037" },
      ],
      denoteColorsForCurrent: [
        { text: "Due", color: "#F2C037" },
        { text: "In Progress", color: "#93BE3B" },
        { text: "Closed", color: "#373737" },
      ],
      denoteColorsForAll: [
        { text: "Completed", color: "#373737" },
      ],
      denoteColorsForConclusions: [
        { text: "Due", color: "#d50000" },
        { text: "In Progress", color: "#F2C037" },
        { text: "Completed", color: "#93BE3B" },
      ],
      allStatusFilter: [],
      filteredStatus: [],
      successMsg: "",
      nameFilter2: "",
      statusFilter2: "",
      monthFilter2: null,
      isBelongsToConclusionHerarchy: false,
      isReviewer: false,
      showMore: false,
      addCategoryCardLayout: false,
      categories: [],
      setDataForEdit: false,
      category: {},
      participants: [],
      appraisal360Data: {},
      clientProjectData: [],
      openAddParticipantForm: false,
      selfFormData: [],
    };
  },
  watch: {
    monthFilter2: function (newVal) {
      this.filter2();
    },
    statusFilter2: function (newVal) {
      this.filter2();
    },
    nameFilter2: function (newVal) {
      this.filter2();
    },
    nameFilter: function (newVal) {
      this.filter();
    },
    statusFilter: function (newVal) {
      this.filter();
    },
    monthFilter: function (newVal) {
      this.filter();
    },
    step: function (val) {
      if (val == 1) {
        this.tab = "Mine";
        this.routeToLoadMyAppraisal();
      } else if (val == 2) {
        this.tab = "Lead";
        this.routeToLoadLeadAppraisal();
      } else if (val == 3) {
        this.tab = "Current";
        this.routeToLoadCurrentAppraisals();
      }
    },
    tab: function (val) {
      this.statusFilter = "";
      this.statusFilter2 = "";
      this.nameFilter = "";
      this.nameFilter2 = "";
      this.monthFilter = null;
      this.monthFilter2 = null;
      this.appraisals = [];
      this.appraisalsToDisplay = [];
      this.showMore = false;
    },
  },
  computed: {
    monthFilterConverted: {
      get() {
        if (this.monthFilter) {
          return this.monthFilter;
        } else {
          return "";
        }
      },
    },
    monthFilterConverted2: {
      get() {
        if (this.monthFilter2) {
          return this.monthFilter2;
        } else {
          return "";
        }
      },
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
      splitterModel: ref(50),
    };
  },
  methods: {
    async getOneMoreAppraisalRecords() {
      this.$q.loading.show();
      this.showMore = true;
      if (this.tab == "Current") {
        this.loadCurrentAppraisals();
      } else if (this.tab == "All") {
        this.loadAllAppraisals();
      } else if (this.tab == "ApprConclusion") {
        this.loadAppraisalConclusion();
      } else if (this.tab == "Reviewer") {
        this.loadReviewerAppraisal();
      } else if (this.tab == "Lead") {
        this.loadLeadAppraisal();
      } else if (this.tab == "AllConclusion") {
        this.loadAllAppraisalConclusionByMentor();
      } else if (this.tab == "Mine") {
        this.loadMyAppraisal();
      } else if (this.tab == "lastConclusion") {
        this.loadLastConclusion();
      } else if (this.tab == "360Appraisals") {
        this.loadAllCurrent360Appraisals();
      } else if (this.tab == "All360Appraisals") {
        this.loadAll360Appraisals();
      }
      this.$q.loading.hide();
    },
    scrolled() {
      var doc = document.getElementsByClassName("q-position-engine");
      if (doc.length > 0) {
        document.activeElement?.click();
        document.activeElement?.blur();
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    async reloadAppraisals() {
      this.$q.loading.show();
      if (this.tab == "Mine") await this.loadMyAppraisal();
      if (this.tab == "Lead") await this.loadLeadAppraisal();
      if (this.tab == "Reviewer") await this.loadReviewerAppraisal();
      if (this.tab == "Current") await this.loadCurrentAppraisals();
      this.$q.loading.hide();
    },
    async filter() {
      this.appraisalsToDisplay = this.appraisals;
      let filterdata = {};
      if (this.monthFilter) {
        let dateValue = this.getStartEndDateOfMonthForFilter(this.monthFilter);
        filterdata.dateFilter = {
          MonthStart: dateValue?.MonthStart,
          MonthEnd: dateValue?.MonthEnd,
        };
      }
      if (this.monthFilter2) {
        let dateValue = this.getStartEndDateOfMonthForFilter(this.monthFilter2);
        filterdata.dateFilter = {
          MonthStart: dateValue?.MonthStart,
          MonthEnd: dateValue?.MonthEnd,
        };
      }
      if (this.nameFilter) {
        filterdata.name = this.nameFilter;
      }
      if (this.nameFilter2) {
        filterdata.name = this.nameFilter2;
      }
      if (this.statusFilter?.id) {
        filterdata.status = this.statusFilter.id;
      }
      if (this.statusFilter?.id) {
        filterdata.status = this.statusFilter.id;
      }
      if (Object.keys(filterdata).length) {
        if (this.tab == "Current") {
          this.appraisalsToDisplay = [];
          let res = await appraisalService.fetchDueAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          this.appraisalsToDisplay = res.data;
        } else if (this.tab == "All") {
          this.appraisalsToDisplay = [];
          let res = await appraisalService.fetchAllCompletedAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          this.appraisalsToDisplay = res.data;
        } else if (this.tab == "ApprConclusion") {
          this.appraisalsToDisplay = [];
          let res = "";
          res = await appraisalService.fetch360CompletedAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          var arrayIds = [];
          let data = [];
          if (res.data.length > 0) {
            res.data.forEach((element) => {
              arrayIds.push({
                userId: element.user._id,
                appraisalId: element._id,
              });
              data.push({
                appraisalId: element._id,
                type: "conclusions",
                user: element.user,
                previousDate: element.dates.lastAppraisalDate,
                currentDate: element.dates.currentAppraisalDate,
                lwp: element.lwp,
                shortFall: element.shortFall,
                totalleaves: element.totalleaves,
                totalworkinghours: element.totalworkinghours,
                text: "",
                reportId: "",
                strength: "",
                performance: "",
                conclusionDate: "",
                status: "due",
              });
            });
            let res1 = await appraisalService.fetchImrpovementOpps(arrayIds);
            data.forEach((ele1) => {
              if (res1.data.length > 0) {
                res1.data.forEach((ele2) => {
                  if (
                    ele2.user == ele1.user._id &&
                    ele2.appraisal_id == ele1.appraisalId
                  ) {
                    ele1.text = ele2.improvementOpportunity;
                    ele1.reportId = ele2._id;
                    ele1.strength = ele2.strengths;
                    ele1.performance = ele2.performance;
                    ele1.conclusionDate = ele2.conclusionDate;
                    ele1.status = ele2.status;
                  }
                });
              }
            });
          }
          this.appraisalsToDisplay = data;
        } else if (this.tab == "Reviewer") {
          this.appraisalsToDisplay = [];
          let res1 = await appraisalService.fetchReviewerAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          this.appraisalsToDisplay = res1.data;
        } else if (this.tab == "Lead") {
          this.appraisalsToDisplay = [];
          let res = await appraisalService.fetchLeadAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          this.appraisalsToDisplay = res.data;
        } else if (this.tab == "AllConclusion") {
          this.appraisalsToDisplay = [];
          let res = "";
          res =
            await appraisalService.fetchAllConclusionHerarchyByMentorIdByFilter(
              this.$store.getters.userId,
              filterdata,
            );
          var arrayIds = [];
          let data = [];
          if (res.data.length > 0) {
            res.data.forEach((element) => {
              arrayIds.push({
                userId: element.user._id,
                appraisalId: element.appraisalId,
              });
              data.push({
                appraisalId: element.appraisalId,
                type: "conclusions",
                user: element.user,
                previousDate: element.previousDate,
                currentDate: element.currentDate,
                lwp: element.lwp,
                shortFall: element.shortFall,
                totalleaves: element.totalleaves,
                totalworkinghours: element.totalworkinghours,
                text: "",
                reportId: "",
                strength: "",
                performance: "",
                conclusionDate: "",
                status: "due",
              });
            });
            let res1 = await appraisalService.fetchImrpovementOpps(arrayIds);
            data.forEach((ele1) => {
              if (res1.data.length > 0) {
                res1.data.forEach((ele2) => {
                  if (
                    ele2.user == ele1.user._id &&
                    ele2.appraisal_id == ele1.appraisalId &&
                    ele2.status == "Completed"
                  ) {
                    ele1.text = ele2.improvementOpportunity;
                    ele1.reportId = ele2._id;
                    ele1.strength = ele2.strengths;
                    ele1.performance = ele2.performance;
                    ele1.conclusionDate = ele2.conclusionDate;
                    ele1.status = ele2.status;
                    this.appraisals.push(ele1);
                  }
                });
              }
            });
          }
          this.appraisalsToDisplay = this.appraisals;
        } else if (this.tab == "Mine") {
          this.appraisalsToDisplay = [];
          let res = await appraisalService.fetchMyAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          this.appraisalsToDisplay = res.data;
        } else if (this.tab == "lastConclusion") {
          this.appraisals = [];
          let res = await appraisalService.fetchCompletedAppraisalsByFilter(
            this.$store.getters.userId,
            filterdata,
          );
          let data = [];
          if (res.data.length > 0) {
            res.data.forEach((element) => {
              data.push({
                appraisalId: element._id,
                type: "conclusions",
                user: element.user,
                previousDate: element.dates.lastAppraisalDate,
                currentDate: element.dates.currentAppraisalDate,
                lwp: element.lwp,
                shortFall: element.shortFall,
                totalleaves: element.totalleaves,
                totalworkinghours: element.totalworkinghours,
                text: "",
                reportId: "",
                strength: "",
                performance: "",
                conclusionDate: "",
                status: "",
              });
            });
            let res1 = await appraisalService.fetchLastConclusion(
              this.$store.getters.userId,
            );
            data.forEach((ele1) => {
              if (res1.data.length > 0) {
                res1.data.forEach((ele2) => {
                  if (ele2.appraisal_id == ele1.appraisalId) {
                    ele1.text = ele2.improvementOpportunity;
                    ele1.reportId = ele2._id;
                    ele1.strength = ele2.strengths;
                    ele1.performance = ele2.performance;
                    ele1.conclusionDate = ele2.conclusionDate;
                    ele1.status = ele2.status;
                  }
                });
              }
            });
          }
          this.appraisals = data;
          this.appraisalsToDisplay = this.appraisals;
        }
        if (this.nameFilter2) {
          this.appraisalsToDisplay = this.appraisalsToDisplay.filter(
            (event) => {
              return (event.user.firstName.trim() + " " + event.user.lastName)
                .toLowerCase()
                .includes(this.nameFilter2.toLowerCase());
            },
          );
        }
        if (this.nameFilter) {
          this.appraisalsToDisplay = this.appraisalsToDisplay.filter(
            (event) => {
              return (event.user.firstName.trim() + event.user.lastName)
                .toLowerCase()
                .includes(this.nameFilter.toLowerCase().replace(/ /g, ""));
            },
          );
        }
        if (this.statusFilter?.id) {
          this.appraisalsToDisplay = this.appraisalsToDisplay.filter(
            (event) => {
              return event.status == this.statusFilter.id;
            },
          );
        }
        if (this.statusFilter2) {
          this.appraisalsToDisplay = this.appraisalsToDisplay.filter(
            (event) => {
              return event.status == this.statusFilter2;
            },
          );
        }
      } else {
        if (this.tab == "Current") {
          this.loadCurrentAppraisals();
        } else if (this.tab == "All") {
          this.loadAllAppraisals();
        } else if (this.tab == "ApprConclusion") {
          this.loadAppraisalConclusion();
        } else if (this.tab == "Reviewer") {
          this.loadReviewerAppraisal();
        } else if (this.tab == "Lead") {
          this.loadLeadAppraisal();
        } else if (this.tab == "AllConclusion") {
          this.loadAllAppraisalConclusionByMentor();
        } else if (this.tab == "Mine") {
          this.loadMyAppraisal();
        } else if (this.tab == "lastConclusion") {
          this.loadLastConclusion();
        }
      }
    },
    filterByName() {
      if (this.nameFilter) {
        this.appraisalsToDisplay = this.appraisalsToDisplay.filter((event) => {
          return (event.user.firstName.trim() + event.user.lastName)
            .toLowerCase()
            .includes(this.nameFilter.toLowerCase().replace(/ /g, ""));
        });
      }
    },
    filterByStatus() {
      if (this.statusFilter?.id) {
        this.appraisalsToDisplay = this.appraisalsToDisplay.filter((event) => {
          return event.status == this.statusFilter.id;
        });
      }
    },
    getStartEndDateOfMonthForFilter(date) {
      if (date) {
        let month = date.split(" ")[0];
        let year = Number(20 + date.split(" ")[1]);
        switch (month) {
          case "Jan":
            var MonthStart = new Date(
              new Date(new Date("01-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("01-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Feb":
            var MonthStart = new Date(
              new Date(new Date("02-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("02-28-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Mar":
            var MonthStart = new Date(
              new Date(new Date("03-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("03-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Apr":
            var MonthStart = new Date(
              new Date(new Date("04-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("04-30-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "May":
            var MonthStart = new Date(
              new Date(new Date("05-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("05-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Jun":
            var MonthStart = new Date(
              new Date(new Date("06-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("06-30-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Jul":
            var MonthStart = new Date(
              new Date(new Date("07-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("07-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Aug":
            var MonthStart = new Date(
              new Date(new Date("08-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("08-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Sep":
            var MonthStart = new Date(
              new Date(new Date("09-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("09-30-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Oct":
            var MonthStart = new Date(
              new Date(new Date("10-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("10-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Nov":
            var MonthStart = new Date(
              new Date(new Date("11-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("11-30-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          case "Dec":
            var MonthStart = new Date(
              new Date(new Date("12-01-2023").setFullYear(year)).setHours(
                0,
                0,
                0,
                0,
              ),
            );
            var MonthEnd = new Date(
              new Date(new Date("12-31-2023").setFullYear(year)).setHours(
                23,
                59,
                0,
                0,
              ),
            );
            break;
          default:
            var MonthStart = new Date(
              new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
            );
            var MonthEnd = new Date(
              new Date(new Date().setDate(28)).setHours(23, 59, 0, 0),
            );
        }
        return {
          MonthStart: MonthStart,
          MonthEnd: MonthEnd,
        };
      }
    },
    filterByDateRange() {
      let data = {};
      if (this.monthFilter) {
        let dateValue = this.getStartEndDateOfMonthForFilter(this.monthFilter);
        data.dateFilter = {
          MonthStart: dateValue?.MonthStart,
          MonthEnd: dateValue?.MonthEnd,
        };
      }
    },
    filter2() {
      this.filter();
      this.appraisalsToDisplay = this.appraisals;
    },
    filterByDateRange2() {
      if (this.monthFilter2) {
        let dateValue = this.getStartEndDateOfMonthForFilter(this.monthFilter2);
        let MonthStart = dateValue.MonthStart;
        let MonthEnd = dateValue.MonthEnd;

        this.appraisalsToDisplay = this.appraisalsToDisplay.filter((event) =>
          moment(event.currentDate).isBetween(MonthStart, MonthEnd),
        );
      }
    },
    filterByStatus2() {
      if (this.statusFilter2) {
        this.appraisalsToDisplay = this.appraisalsToDisplay.filter((event) => {
          return event.status == this.statusFilter2;
        });
      }
    },
    filterByName2() {
      if (this.nameFilter2) {
        this.appraisalsToDisplay = this.appraisalsToDisplay.filter((event) => {
          return (event.user.firstName.trim() + " " + event.user.lastName)
            .toLowerCase()
            .includes(this.nameFilter2.toLowerCase());
        });
      }
    },
    clearFilters() {
      this.monthFilter = null;
      this.nameFilter = "";
      this.statusFilter = "";
      this.appraisalsToDisplay = [];
    },
    routeToLoad360AppraisalsOnIconClick(data) {
      this.filtereDataForCurrent360Appraisal = data.appraisalId;
      if (data.routeName == "current360") {
        this.tab = "360Appraisals";
        this.loadAllCurrent360Appraisals();
      } else {
        this.tab = "All360Appraisals";
        this.loadAll360Appraisals();
      }
    },
    update360CardOnSubmit(data) {
      this.appraisalsToDisplay.map((ele) => {
        if (ele._id == data.initiate360Id) {
          let cardStatus = true;
          ele.participants.forEach((participant) => {
            if (participant._id == data.participantId) {
              participant.status =
                data.status == FeedbackStatus.SUBMITTED
                  ? FeedbackStatus.DONE
                  : FeedbackStatus.INPROGRESS;
            } else {
              cardStatus =
                participant.status == FeedbackStatus.INPROGRESS ? false : true;
            }

            ele.status = cardStatus ? FeedbackStatus.COMPLETED : ele.status;
          });
        }
      });
      this.appraisalsToDisplay.forEach((element) => {
        const totalParticipants = element.participants.length;
        let totalSubmit = 0;
        element.participants.forEach((ele) => {
          ele.status == FeedbackStatus.DONE ? (totalSubmit += 1) : "";
        });
        const progressBarValue = (totalSubmit / totalParticipants) * 100;
        element.progressBarValue = progressBarValue;
      });
    },
    routeToLoadSelfForm() {
      if (this.tab == "SelfForm") {
        this.showMore = false;
        this.loadSelfForm();
      }
    },
    routeToLoadLeadForm() {
      if (this.tab == "LeadForm") {
        this.showMore = false;
        this.loadLeadForm();
      }
    },
    routeToLoadRatings() {
      if (this.tab == "Ratings") {
        this.showMore = false;
        this.appraisalsToDisplay = [];
        this.loadRatings();
      }
    },
    routeToLoadCurrentAppraisals() {
      if (this.tab == "Current") {
        this.showMore = false;
        this.loadCurrentAppraisals();
        this.getAllStatus();
      }
    },
    routeToLoadAllAppraisals() {
      if (this.tab == "All") {
        this.showMore = false;
        this.loadAllAppraisals();
        this.getAllStatus();
      }
    },
    routeToLoadMyAppraisal() {
      if (this.tab == "Mine") {
        this.loadMyAppraisal();
      }
    },
    routeToLoadLeadAppraisal() {
      if (this.tab == "Lead") {
        this.showMore = false;
        this.loadLeadAppraisal();
      }
    },
    routeToLoadReviewerAppraisal() {
      if (this.tab == "Reviewer") {
        this.showMore = false;
        this.loadReviewerAppraisal();
      }
    },
    routeToLoadAppraisalConclusion() {
      if (this.tab == "ApprConclusion") {
        this.showMore = false;
        this.loadAppraisalConclusion();
      }
    },
    routeToLoadAppraisalConclusionByMantor() {
      if (this.tab == "AllConclusion") {
        this.showMore = false;
        this.loadAllAppraisalConclusionByMentor();
      }
    },
    routeToLoadContributions() {
      if (this.tab == "Contributions") {
        this.loadContributions();
      }
    },
    routeToLoadLastConclusion() {
      if (this.tab == "lastConclusion") {
        this.loadLastConclusion();
      }
    },
    routesToLoad360Categories() {
      if (this.tab == "360Categories") {
        this.loadAll360Categories();
      }
    },
    routeToLoad360Appraisal() {
      if (this.tab == "360Appraisals") {
        this.filtereDataForCurrent360Appraisal = null;
        this.loadAllCurrent360Appraisals();
      }
    },
    routeToLoadAll360Appraisals() {
      if (this.tab == "All360Appraisals") {
        this.filtereDataForCurrent360Appraisal = null;
        this.loadAll360Appraisals();
      }
    },
    async loadMyAppraisal() {
      this.$q.loading.show();
      let res = await appraisalService.fetchMyAppraisals(
        this.$store.getters.userId,
      );
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Self");
      this.$q.loading.hide();
    },
    async loadLeadAppraisal() {
      this.$q.loading.show();
      let res = await appraisalService.fetchLeadAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Lead Appraisal");
      this.$q.loading.hide();
    },
    async loadReviewerAppraisal() {
      this.$q.loading.show();
      let res1 = await appraisalService.fetchReviewerAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      this.appraisals = res1.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Reviewer Appraisal");
      this.$q.loading.hide();
    },
    async loadCurrentAppraisals() {
      this.$q.loading.show();
      this.appraisals = [];
      let res = await appraisalService.fetchDueAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Current Appraisal");
      this.$q.loading.hide();
    },
    async loadAllAppraisals() {
      this.clearFilters();
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      let res = await appraisalService.fetchAllCompletedAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "All Appraisal");
      this.$q.loading.hide();
    },
    async loadSelfForm() {
      this.$q.loading.show();
      let res = await appraisalService.fetchSelfForm();
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Self Form");
      this.$q.loading.hide();
    },
    async loadLeadForm() {
      this.$q.loading.show();
      let res = await appraisalService.fetchLeadForm();
      this.appraisals = res.data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Lead Form");
      this.$q.loading.hide();
    },
    async loadRatings() {
      //if we have fetch all ratings
      this.$q.loading.show();
      let res = await appraisalService.fetchRatings();
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          this.appraisalsToDisplay.push({
            id: element._id,
            text: element.area_of_ratings,
            status: element.isActive,
            type: "ratings",
          });
        });
      }
      this.$store.commit("changeTabName", "Ratings");
      this.$q.loading.hide();
    },
    async loadAppraisalConclusion() {
      //if we have fetch all current appraisal
      this.$q.loading.show();
      this.appraisals = [];
      this.appraisalsToDisplay = [];
      let res = "";
      res = await appraisalService.fetch360CompletedAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      var arrayIds = [];
      let data = [];
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          arrayIds.push({
            userId: element.user._id,
            appraisalId: element._id,
          });
          data.push({
            appraisalId: element._id,
            type: "conclusions",
            user: element.user,
            previousDate: element.dates.lastAppraisalDate,
            currentDate: element.dates.currentAppraisalDate,
            lwp: element.lwp,
            shortFall: element.shortFall,
            totalleaves: element.totalleaves,
            totalworkinghours: element.totalworkinghours,
            text: "",
            reportId: "",
            strength: "",
            performance: "",
            conclusionDate: "",
            status: "due",
          });
        });
        let res1 = await appraisalService.fetchImrpovementOpps(arrayIds);
        data.forEach((ele1) => {
          if (res1.data.length > 0) {
            res1.data.forEach((ele2) => {
              if (
                ele2.user == ele1.user._id &&
                ele2.appraisal_id == ele1.appraisalId
              ) {
                ele1.text = ele2.improvementOpportunity;
                ele1.reportId = ele2._id;
                ele1.strength = ele2.strengths;
                ele1.performance = ele2.performance;
                ele1.conclusionDate = ele2.conclusionDate;
                ele1.status = ele2.status;
              }
            });
          }
        });
      }
      this.appraisals = data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Conclusion History");
      this.$q.loading.hide();
    },

    async loadAllAppraisalConclusionByMentor() {
      //if we have fetch all current appraisal
      this.$q.loading.show();
      this.appraisals = [];
      this.appraisalsToDisplay = [];
      let res = "";
      res = await appraisalService.fetchAllConclusionHerarchyByMentorId(
        this.$store.getters.userId,
        this.showMore,
      );
      var arrayIds = [];
      let data = [];
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          arrayIds.push({
            userId: element.user._id,
            appraisalId: element.appraisalId,
          });
          data.push({
            appraisalId: element.appraisalId,
            type: "conclusions",
            user: element.user,
            previousDate: element.previousDate,
            currentDate: element.currentDate,
            lwp: element.lwp,
            shortFall: element.shortFall,
            totalleaves: element.totalleaves,
            totalworkinghours: element.totalworkinghours,
            text: "",
            reportId: "",
            strength: "",
            performance: "",
            conclusionDate: "",
            status: "due",
          });
        });
        let res1 = await appraisalService.fetchImrpovementOpps(arrayIds);
        data.forEach((ele1) => {
          if (res1.data.length > 0) {
            res1.data.forEach((ele2) => {
              if (
                ele2.user == ele1.user._id &&
                ele2.appraisal_id == ele1.appraisalId &&
                ele2.status == "Completed"
              ) {
                ele1.text = ele2.improvementOpportunity;
                ele1.reportId = ele2._id;
                ele1.strength = ele2.strengths;
                ele1.performance = ele2.performance;
                ele1.conclusionDate = ele2.conclusionDate;
                ele1.status = ele2.status;
                this.appraisals.push(ele1);
              }
            });
          }
        });
      }
      //this.appraisals=this.result;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "All Conclusion");
      this.$q.loading.hide();
    },

    async loadContributions() {
      //if we have fetch all contributions
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      let res = await appraisalService.fetchContributions();
      res.data.forEach((element) => {
        this.appraisalsToDisplay.push({
          id: element._id,
          text: element.contribution,
          status: element.isActive,
          type: "contributions",
        });
      });
      this.$store.commit("changeTabName", "Contributions");
      this.$q.loading.hide();
    },
    async getAllStatus() {
      this.allStatusFilter = [];
      var Value = "Appraisal";
      const res = await flow_levelService.flow_level(Value);
      res.data.forEach((ele) => {
        if (ele.stage != "rejected" && ele.stage != "360Completed") {
          this.allStatusFilter.push({
            id: ele.stage,
            label: ele.stage,
          });
        }
      });
      this.filteredStatus = this.allStatusFilter;
    },
    async loadLastConclusion() {
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      this.appraisals = [];
      let res = await appraisalService.fetchCompletedAppraisals(
        this.$store.getters.userId,
      );
      let data = [];
      if (res.data.length > 0) {
        res.data.forEach((element) => {
          data.push({
            appraisalId: element._id,
            type: "conclusions",
            user: element.user,
            previousDate: element.dates.lastAppraisalDate,
            currentDate: element.dates.currentAppraisalDate,
            lwp: element.lwp,
            shortFall: element.shortFall,
            totalleaves: element.totalleaves,
            totalworkinghours: element.totalworkinghours,
            text: "",
            reportId: "",
            strength: "",
            performance: "",
            conclusionDate: "",
            status: element.status,
          });
        });
        let res1 = await appraisalService.fetchLastConclusion(
          this.$store.getters.userId,
        );
        data.forEach((ele1) => {
          if (res1.data.length > 0) {
            res1.data.forEach((ele2) => {
              if (ele2.appraisal_id == ele1.appraisalId) {
                ele1.text = ele2.improvementOpportunity;
                ele1.reportId = ele2._id;
                ele1.strength = ele2.strengths;
                ele1.performance = ele2.performance;
                ele1.conclusionDate = ele2.conclusionDate;
                ele1.status = ele2.status;
              }
            });
          }
        });
      }
      this.appraisals = data;
      this.appraisalsToDisplay = this.appraisals;
      this.$store.commit("changeTabName", "Last Conclusion");
      this.$q.loading.hide();
    },

    async loadConclusionTabs() {
      this.$q.loading.show();
      let res = await appraisalService.fetchMenteesCount(
        this.$store.getters.userId,
      );
      this.isBelongsToConclusionHerarchy = res.data.length > 0;
      //true; //from here we need to handle the visibility of conclusion history
      // show reviewer tab if user is reviewer
      let res1 = await appraisalService.fetchReviewerAppraisals(
        this.$store.getters.userId,
        this.showMore,
      );
      this.isReviewer = res1.data.length > 0;
      this.$q.loading.hide();
    },
    async loadAll360Categories() {
      this.categories = [];
      this.$q.loading.show();
      let res = await category360Service.getAll360Categories();
      this.categories = [...res.data];
      this.$store.commit("changeTabName", "360 Categories");
      if (res.data.length > 0) {
        let data = { categoryId: res.data[0]._id };
        this.category = res.data[0];
        let result =
          await category360Service.getAll360CategoryParametersByCategoryId(
            data,
          );
        result.data.length > 0
          ? (this.categoryParameterList = [...result.data[0].parameters])
          : "";
      }
      this.$q.loading.hide();
    },
    async loadAllCurrent360Appraisals() {
      this.participants = [];
      this.appraisal360Data = {};
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      let res = await appraisal360Service.getAll360Appraisals({
        status: Current360Status.INPROGRESS,
      });
      if (res?.data?.length > 0) {
        if (this.filtereDataForCurrent360Appraisal) {
          res.data = res.data.filter(
            (item) =>
              item.appraisal._id == this.filtereDataForCurrent360Appraisal,
          );
        }
        res.data = res.data.filter(
          (item) =>
            item.appraisal.stage != FeedbackStatus.CONCLUDED &&
            item.appraisal.status != FeedbackStatus.CONCLUDED,
        );
        this.appraisalsToDisplay = [...res.data];
        this.appraisal360Data = res.data[0];
        this.participants = [...res.data[0].participants];
      }
      this.appraisalsToDisplay.forEach((element) => {
        const totalParticipants = element.participants.length;
        let totalSubmit = 0;
        element.participants.forEach((ele) => {
          ele.status == FeedbackStatus.DONE ? (totalSubmit += 1) : "";
        });
        const progressBarValue = (totalSubmit / totalParticipants) * 100;
        element.progressBarValue = progressBarValue;
      });
      this.$store.commit("changeTabName", "Current 360 Appraisals");
      this.$q.loading.hide();
    },
    loadAllParticipantsBy360Card(user360AppraisalData) {
      this.participants = [];
      this.participants = [...user360AppraisalData.participants];
      this.appraisal360Data = null;
      this.appraisal360Data = user360AppraisalData;
    },
    async refreshInitiate360CardData(updated360Data) {
      this.openAddParticipantForm = false;
      const res = await appraisal360Service.getAll360Appraisals({
        status: "inprogress",
      });
      if (res.data.length > 0) {
        this.appraisalsToDisplay = [...res.data];
        this.appraisal360Data = null;
        this.appraisal360Data = this.appraisalsToDisplay.filter(
          (ele) =>
            ele.user._id == updated360Data.user &&
            ele.appraisal._id == updated360Data.appraisal,
        )[0];
        this.participants = [];
        const assignable = this.appraisal360Data.participants;
        this.participants = assignable;
        this.appraisalsToDisplay.forEach((element) => {
          const totalParticipants = element.participants.length;
          let totalSubmit = 0;
          element.participants.forEach((ele) => {
            ele.status == FeedbackStatus.DONE ? (totalSubmit += 1) : "";
          });
          const progressBarValue = (totalSubmit / totalParticipants) * 100;
          element.progressBarValue = progressBarValue;
        });
        if (this.filtereDataForCurrent360Appraisal) {
          this.appraisalsToDisplay = this.appraisalsToDisplay.filter(
            (item) =>
              item.appraisal._id == this.filtereDataForCurrent360Appraisal,
          );
        }
      }
    },
    async loadAllParameterByCategoryId(e) {
      this.categoryParameterList = [];
      this.$q.loading.show();
      let data = { categoryId: e._id };
      let res =
        await category360Service.getAll360CategoryParametersByCategoryId(data);
      if (res.data.length > 0) {
        this.categoryParameterList = [...res.data[0].parameters];
        this.category = res.data[0];
      }
      this.$q.loading.hide();
    },
    async loadAll360Appraisals() {
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      const res = await appraisal360Service.getAll360Appraisals({
        status: FeedbackStatus.COMPLETED,
      });
      if (res.data.length > 0) {
        if (this.filtereDataForCurrent360Appraisal) {
          res.data = res.data.filter(
            (item) =>
              item.appraisal._id == this.filtereDataForCurrent360Appraisal,
          );
        }
        this.appraisalsToDisplay = [...res.data];
      }
      this.$store.commit("changeTabName", "All 360 Appraisals");
      this.$q.loading.hide();
    },
    openAddCategoryDialog() {
      this.addCategoryCardLayout = true;
      this.setDataForEdit = false;
    },
    openParameterFormDialog() {
      this.isParameterForm = true;
      this.addCategoryCardLayout = true;
    },
    async openParticipantsFormDialog() {
      this.$q.loading.show();
      this.selfFormData = [];
      const res = await appraisalService.fetchInitate360Data(
        this.appraisal360Data.appraisal._id,
      );
      this.selfFormData = res.data;
      this.clientProjectData = res.data;
      let user360Data = this.appraisal360Data;
      user360Data.participants = user360Data.participants.map((u) => ({
        ...u,
        isRemovable: false,
      }));
      if (this.clientProjectData.length > 0) {
        this.clientProjectData.forEach((ele) => {
          if (ele.PerProjects.length > 0) {
            ele?.PerProjects?.forEach((ele1) => {
              ele1?.coworkers?.forEach((cd) => {
                user360Data.participants.findIndex((p) => p._id == cd._id) >= 0
                  ? (cd.isSelected = true)
                  : "";
                cd.isLead =
                  user360Data.appraisal.supervisor._id == cd._id ? true : false;
              });
            });
          }
        });
        this.$q.loading.hide();
        this.clientProjectData = this.clientProjectData.filter(
          (cp) => cp !== undefined,
        );
        this.openAddParticipantForm = true;
      }
    },
    changeDataForEdit() {
      this.setDataForEdit = false;
    },
    closeCategoryForm(e) {
      this.addCategoryCardLayout = false;
      this.isParameterForm = false;
    },
    async updateParameterList(data) {
      if (data.isCategoryData) {
        this.categories.push(data.newData);
      } else {
        if (data.isUpdated) {
          const isContains = (element) => element._id == data.changedData._id;
          const index = this.categoryParameterList.findIndex(isContains);
          if (index !== -1) {
            this.categoryParameterList[index].name = data.changedData.name;
            this.categoryParameterList[index].description =
              data.changedData.description;
          }
        } else {
          this.categoryParameterList.push(data.newData);
        }
      }
    },
    updateCategoryList: function (data) {
      if (data.isUpdated) {
        const isContains = (element) => element._id == data.changedData._id;
        const index = this.categories.findIndex(isContains);
        if (index !== -1) {
          this.categories[index] = data.changedData;
          this.category = data.changedData;
        }
      } else {
        this.categories.push(data.newData);
      }
    },
    closeParticipantsForm() {
      this.openAddParticipantForm = false;
    },
  },
  mounted() {
    this.loadMyAppraisal();
    this.loadConclusionTabs();
  },
  created() {},
  updated() {
    let cardContainer = document.getElementById("card-container");
  },
};
</script>

<style>
.timesheet_tabs .q-tabs__content {
  height: 80vh !important;
  overflow-y: auto;
}

.appraisal-yahin-par {
  padding-top: 12px;
}

.scroll_timesheet {
  height: 67vh !important;
}

.q-expansion-item .q-tab__label {
  font-size: 12px !important;
}

.full-width .q-splitter__panel.q-splitter__before {
  width: 50% !important;
}

.card-container {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  height: 75vh !important;
}
</style>
