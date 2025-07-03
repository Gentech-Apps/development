<template>
  <div v-if="openPrevFormLayout" class="feedbackTable">
    <q-card>
      <q-card-section class="q-pt-none">
        <div
          style="
            color: red;
            width: 100.5%;
            display: flex;
            background: white;
            z-index: 5;
            top: 55%;
            height: 54px !important;
          "
          class="participant-name fs--18 text-bold justify-between"
        >
          <div class="q-mt-sm">{{ `${participantName}'s Feedback` }}</div>
          <div
            class="select-category row float-right justify-around"
            style="width: 470px"
          >
            <div class="select-heading q-mt-sm q-mx-md text-black">
              Select Category
            </div>
            <q-select
              outlined
              multiple
              dense
              v-model="selectedCategory"
              use-input
              input-debounce="0"
              input-class="ellipsis-input"
              :options="filteredCategories"
              @filter="updateSelectedCategory"
              label="Select Categories"
              map-options
              option-value="id"
              option-label="label"
              @update:modelValue="filterFnCategories"
              style="width: 300px !important"
              class="ellipsis"
              clearable
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

        <div :class="getClassName">
          <table class="feedbackTable" style="width: 100%">
            <thead>
              <tr>
                <th colspan="2" style="min-width: 250px !important">
                  Category/Parameter
                </th>
                <th>Comments</th>
                <th>Ratings</th>
              </tr>
            </thead>
            <tbody v-for="iterator in displayTableData">
              <tr v-for="(value, key, index) in iterator" :key="key">
                <td
                  v-if="index == 0"
                  v-for="(cell, arrayIndex) in value"
                  :key="cell"
                  :rowspan="arrayIndex == 0 ? value.keys.length : ''"
                  :class="arrayIndex == 0 ? 'setColumnWidth' : ''"
                  style="
                    padding: 0px !important;
                    height: 60px !important;
                    max-width: 260px;
                    overflow: auto;
                    width: 260px;
                  "
                  @click="openEditableCell(cell, value)"
                >
                  <div
                    :id="cell.id"
                    class="content-center"
                    v-if="
                      cell.field == this.tableFieldNames[0] ||
                      cell.field == this.tableFieldNames[1]
                    "
                  >
                    {{ displayComments(cell.value, cell.id) }} test
                  </div>
                  <div v-else class="content-center">
                    <span
                      :id="cell.id"
                      v-bind:hidden="cell.id == editCellId"
                      :disable="cell.disableColumn"
                      style="
                        max-width: 260px !important;
                        padding: 3px !important;
                      "
                      >{{
                        cell.field == "ratings"
                          ? capitalizeFirstLetter(cell.rating)
                          : displayComments(cell.value, cell.id)
                      }}</span
                    >
                  </div>
                </td>
                <td
                  v-else
                  v-for="(cell, arrayIndex) in value"
                  :class="arrayIndex == 0 ? 'setDisplayNone' : ''"
                  style="
                    padding: 0px !important;
                    height: 60px !important;
                    max-width: 260px;
                    overflow: auto;
                    width: 260px;
                  "
                  @click="openEditableCell(cell, value)"
                >
                  <div
                    :id="cell.id"
                    class="content-center"
                    v-if="
                      cell.field == this.tableFieldNames[0] ||
                      cell.field == this.tableFieldNames[1]
                    "
                  >
                    {{ displayComments(cell.value, cell.id) }}
                  </div>
                  <div v-else class="content-center">
                    <span
                      :id="cell.id"
                      v-bind:hidden="cell.id == editCellId"
                      style="
                        max-width: 260px !important;
                        padding: 3px !important;
                      "
                      >{{
                        cell.field == "ratings"
                          ? capitalizeFirstLetter(cell.rating)
                          : displayComments(cell.value, cell.id)
                      }}</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <FeedbackEditor
    :editorLayout="editorLayout"
    :feedbackData="feedbackData"
    @saveFeedback="saveCellData"
    @closeEditor="closeEditor"
  />
</template>

<script>
import { FeedbackStatus } from "../../constants/feedbackConstants.js";
import FeedbackEditor from "../../components/Appraisal/360FeedbackEditor.vue";
import * as functions from "../../services/functions";

export default {
  components: {
    FeedbackEditor,
  },
  props: [
    "openPrevForm",
    "tableData",
    "categoryData",
    "status",
    "participantName",
    "expanded",
  ],
  data() {
    return {
      openPrevFormLayout: false,
      displayTableData: [],
      userNames: [],
      displayCategoryData: [],
      participantAnswer: [],
      editCell: false,
      editCellId: null,
      filteredCategories: [],
      categories: [],
      duplicateTableData: [],
      selectedCategory: [],
      tableFieldNames: ["categoryName", "parameterName", "comments", "ratings"],
      SaveFeedbackFormEvent: "saveFeedbackForm",
      DraftButtonStatusEvent: "draftStatus",
      editorLayout: false,
      feedbackData: {
        cellId: null,
        category: null,
        categoryId: null,
        parameter: null,
        parameterId: null,
        feedback: null,
        rating: null,
      },
    };
  },
  computed: {
    getClassName: function () {
      if (this.expanded) {
        const hasAnyPreviousFeedbacks = this.tableData.some(
          (e) =>
            (e?.parameterPrev?.length ?? 0) > 0 ||
            e?.parameterAnswers?.some(
              (q) => (q?.otherParticipantFeedback?.length ?? 0) > 0,
            ),
        );
        return this.tableData.length > 0 &&
          this.DraftButtonStatusEvent &&
          hasAnyPreviousFeedbacks
          ? "reduceTableHeight"
          : "setTableWidthAndHeight2";
      } else {
        return "setTableWidthAndHeight";
      }
    },
  },
  watch: {
    openPrevForm: function (val) {
      this.openPrevFormLayout = val;
      this.handleStatusChange();
    },
    status: function (val) {
      this.openPrevFormLayout = val;
      if (val == FeedbackStatus.SUBMITTED) this.handleStatusChange();
    },
  },
  methods: {
    displayComments(text, id) {
      setTimeout(() => {
        // Element is taking time to render so we use timeout.
        const spanElem = document.getElementById(id);
        spanElem.innerHTML = text;
      }, 200);
    },
    sanitiseComments(text) {
      const sanitisedText = text
        ?.replace(/<[^>]+(>|$)/g, "")
        .replaceAll("&nbsp;", " ");
      return sanitisedText;
    },
    openEditableCell(cell, rowData) {
      if (
        cell.field == this.tableFieldNames[2] &&
        this.isEditableCell(cell, rowData)
      ) {
        this.feedbackData = {
          cellId: cell.id,
          category: rowData[0].value,
          categoryId: cell.categoryId,
          parameter: rowData[1].value,
          parameterId: cell.parameterId,
          feedback: cell.value,
          rating: cell.rating,
        };
        this.editorLayout = true;
      }
    },
    isEditableCell(cell, rowData) {
      const [category, param, ...data] = rowData;

      if (
        this.status != FeedbackStatus.INPROGRESS &&
        this.status != FeedbackStatus.STARTED
      ) {
        return false;
      }

      if (this.sanitiseComments(cell.value) != "") {
        return true;
      }

      if (!data.some((elem) => this.sanitiseComments(elem.value) != "")) {
        return true;
      }
    },
    cellVisible(cell, value) {
      value.forEach((element) => {
        if (element.field == this.tableFieldNames[2] && element.id != cell.id) {
          element.disableColumn = cell.value ? true : false;
        }
      });
      this.editCell = false;
      this.editCellId = null;
    },
    saveCellData(data) {
      this.participantAnswer.forEach((element) => {
        if (element.category == this.feedbackData.categoryId) {
          element.parameterAnswers.forEach((iterator) => {
            if (iterator.parameter == this.feedbackData.parameterId) {
              iterator.rating = data.rating ? data.rating : "";
              iterator.answer = data.description ? data.description : "";
            }
          });
        }
      });
      this.$emit(this.SaveFeedbackFormEvent, this.participantAnswer);
      let draftbtnStatus = true;
      this.participantAnswer.forEach((element) => {
        element.parameterAnswers.forEach((answer) => {
          if (answer.answer.length > 0) draftbtnStatus = false;
        });
      });

      for (const element in this.displayTableData) {
        const parameterArray = this.displayTableData[element];
        for (const parameter in parameterArray) {
          const cellArray = parameterArray[parameter];
          cellArray.forEach((cell) => {
            if (cell.id == data.cellId) {
              cellArray[2] = {
                ...cellArray[2],
                value: data.description ? data.description : "",
                rating: data.rating ? data.rating : "",
              };
              cellArray[3] = {
                ...cellArray[3],
                value: data.description ? data.description : "",
                rating: data.rating ? data.rating : "",
              };
            }
            return;
          });
        }
      }
      if (data.description?.trim() || data.rating) {
        this.closeEditor();
      }
      this.$emit(this.DraftButtonStatusEvent, draftbtnStatus);
    },
    updateSelectedCategory(val, update, abort) {
      this.filteredCategories = this.categories;
      update(() => {
        const needle = val.toLocaleLowerCase();
        this.filteredCategories = this.categories.filter(
          (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1,
        );
      });
    },
    filterFnCategories() {
      const filteredCategoriesData = [];
      this.displayTableData = [...this.duplicateTableData];
      if (this.selectedCategory.length > 0) {
        this.selectedCategory.forEach((category) => {
          this.displayTableData?.forEach((dataArray, index, object) => {
            Object.keys(dataArray).every(function (key) {
              const isMatched = dataArray[key][0].value == category.label;
              if (isMatched) filteredCategoriesData.push(dataArray);
            });
          });
        });
        this.displayTableData = [...filteredCategoriesData];
      }
    },
    handleStatusChange() {
      this.categories = [];
      this.participantAnswer = [];
      this.displayCategoryData = this.categoryData;
      this.categoryData?.map((category) => {
        this.categories.push({
          id: category._id,
          label: category.name,
        });
      });
      this.filteredCategories = [...this.categories];
      if (this.status == FeedbackStatus.STARTED) {
        this.displayTableData = [];
        this.userNames = [];

        let preparedRow = {};
        for (let index = 0; index < this.displayCategoryData.length; index++) {
          const element = this.displayCategoryData[index];
          const categoryObject = {};
          categoryObject.category = element._id;
          categoryObject.parameterAnswers = [];
          let form = [];
          for (let index1 = 0; index1 < element.parameters.length; index1++) {
            const element1 = element.parameters[index1];
            form.push({
              field: this.tableFieldNames[0],
              value: element.name,
              id: element._id,
            });
            form.push({
              field: this.tableFieldNames[1],
              value: element1.name,
              id: element1._id,
            });
            form.push({
              field: this.tableFieldNames[2],
              value: "",
              id: (Math.random() + 1).toString(36).substring(7),
              disableColumn: false,
              rating: "",
              categoryId: element._id,
              parameterId: element1._id,
            });
            form.push({
              field: this.tableFieldNames[3],
              value: "",
              id: (Math.random() + 1).toString(36).substring(7),
              disableColumn: false,
              rating: "",
              categoryId: element._id,
              parameterId: element1._id,
            });
            preparedRow[element1.name] = form;
            form = [];
            categoryObject.parameterAnswers.push({
              parameter: element1._id,
              rating: "",
              answer: "",
            });
          }
          this.participantAnswer.push(categoryObject);
          this.displayTableData.push(preparedRow);
          preparedRow = {};
        }
      } else {
        this.displayTableData = [];
        this.userNames = [];

        for (let index = 0; index < this.displayCategoryData.length; index++) {
          const element = this.displayCategoryData[index];
          let preparedRow = {};
          for (let index1 = 0; index1 < this.tableData.length; index1++) {
            const element1 = this.tableData[index1];
            let answerArray = [];

            if (element._id == element1.category._id) {
              const categoryObject = {};
              categoryObject.category = element1.category._id;
              categoryObject.parameterAnswers = [];
              element1.parameterAnswers.forEach((cell, index3) => {
                answerArray.push({
                  field: this.tableFieldNames[0],
                  value: element1.category.name,
                  id: element1.category._id,
                });
                answerArray.push({
                  field: this.tableFieldNames[1],
                  value: cell.name,
                  id: cell._id,
                });
                answerArray.push({
                  field: this.tableFieldNames[2],
                  value: cell.answer ?? "",
                  id: (Math.random() + 1).toString(36).substring(7),
                  disableColumn:
                    this.status == FeedbackStatus.SUBMITTED
                      ? true
                      : element1.parameterAnswers[index3].answer.length != 0,
                  rating: cell.rating ?? "",
                  categoryId: element1.category._id,
                  parameterId: cell.parameter,
                });
                answerArray.push({
                  field: this.tableFieldNames[3],
                  value: cell.answer ?? "",
                  id: (Math.random() + 1).toString(36).substring(7),
                  disableColumn:
                    this.status == FeedbackStatus.SUBMITTED
                      ? true
                      : element1.parameterAnswers[index3].answer.length != 0,
                  rating: cell.rating ?? "",
                  categoryId: element1.category._id,
                  parameterId: cell.parameter,
                });
                const userName = cell.firstName + " " + cell.lastName;
                !this.userNames.includes(userName)
                  ? this.userNames.push(userName)
                  : "";
                preparedRow[cell.name] = answerArray;
                answerArray = [];
                categoryObject.parameterAnswers.push({
                  parameter: cell.parameter,
                  rating: cell.rating,
                  answer:
                    cell.answer != ""
                      ? cell.answer
                      : element1.parameterAnswers[index3].answer,
                });
              });
              this.participantAnswer.push(categoryObject);
            }
          }
          this.displayTableData.push(preparedRow);
        }
      }
      this.duplicateTableData = [...this.displayTableData];
    },
    closeEditor() {
      this.editorLayout = false;
      this.feedbackData = null;
    },
    capitalizeFirstLetter(string) {
      return functions.capitalizeFirstLetter(string);
    },
  },
};
</script>

<style>
.setTableWidthAndHeight {
  margin-top: 5px;
  max-height: 73vh;
  overflow-y: scroll;
}
.feedbackTable {
  border-collapse: separate;
  border-spacing: 0;
}
.feedbackTable td,
.feedbackTable th {
  border: 0.5px solid black;
  padding: 15px;
}

.feedbackTable th,
.feedbackTable td {
  min-width: 175px;
}

.feedbackTable thead tr th {
  z-index: 3 !important;
  background: white;
}
.feedbackTable thead tr th:last-child {
  border-right: 2px solid black !important;
}
.feedbackTable thead tr:first-child th:first-child {
  z-index: 4 !important;
  left: 0px;
  position: sticky;
  background: white;
  border-left: 2px solid black !important;
}

.feedbackTable tbody tr td:first-child {
  z-index: 2 !important;
  left: 0px;
  position: sticky;
  background: white;
  border-left: 2px solid black !important;
}
.feedbackTable tbody tr td:nth-child(2) {
  z-index: 2 !important;
  left: 175px;
  position: sticky;
  background: white;
}

.feedbackTable tbody:last-child tr:last-child td {
  border-bottom: 2px solid black !important;
}
.feedbackTable tbody:last-child tr:nth-child(n-1) td:first-child {
  border-bottom: 2px solid black !important;
}
.feedbackTable tbody tr td:last-child {
  border-right: 2px solid black !important;
}
.feedbackTable tbody tr td {
  z-index: 1 !important;
  left: 0px;
  position: sticky;
  background: white;
  align-items: center;
  justify-content: center;
}
.setColumnWidth {
  max-width: 150px !important;
}
.setDisplayNone {
  display: none;
}

.content-center {
  display: flex;
  justify-content: center;
}

.feedbackTable table th {
  border-top: 2px solid black !important;
}

.feedbackTable .q-card {
  box-shadow: none;
}

.select-category .q-field--auto-height.q-field--dense .q-field__control,
.select-category .q-field--auto-height.q-field--dense .q-field__native {
  max-height: 40px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}

.reduceTableHeight {
  margin-top: 5px;
  max-height: 34vh;
  overflow-y: scroll;
}

.setTableWidthAndHeight2 {
  margin-top: 5px;
  max-height: 65vh;
  overflow-y: scroll;
}
</style>
