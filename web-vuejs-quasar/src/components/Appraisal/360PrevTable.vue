<template>
  <div v-if="openPrevFormLayout" class="prevTableShadow">
    <q-card>
      <q-card-section
        class="q-pt-none"
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 0px !important;
        "
      >
        <div class="setTableWidth" v-if="userNames.length > 0">
          <table class="prevTable" style="width: 100%">
            <thead>
              <tr>
                <th colspan="2" style="min-width: 250px !important">
                  Category
                </th>
                <th v-for="name in userNames">{{ name }}</th>
              </tr>
            </thead>
            <tbody v-for="iterator in displayTableData">
              <tr v-for="(value, key, index) in iterator" :key="key">
                <td
                  v-if="index == 0"
                  v-for="(cell, arrayIndex) in value"
                  :rowspan="arrayIndex == 0 ? value.keys.length : ''"
                  :class="arrayIndex == 0 ? 'setColumnWidth' : ''"
                  :style="getFeedbackColor(cell)"
                >
                  <div v-html="cell.value"></div>
                </td>
                <td
                  v-else
                  v-for="(cell, arrayIndex) in value"
                  :class="arrayIndex == 0 ? 'setDisplayNone' : ''"
                  :style="getFeedbackColor(cell)"
                >
                  <div v-html="cell.value"></div>
                </td>
              </tr>
            </tbody>
            <!-- </div> -->
          </table>
        </div>
        <div
          v-else
          style="
            display: flex;
            justify-content: center;
            border: 1px solid black;
          "
        >
          No Feedback Submitted yet!
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { FeedbackPreviewColors } from "src/constants/feedbackPreviewColorConstants";

export default {
  props: ["openPrevForm", "tableData", "categoryData", "view360Form", "reopen"],
  data() {
    return {
      openPrevFormLayout: false,
      displayTableData: [],
      userNames: [],
      displayCategoryData: [],
      feedbackCategories: ["good", "average", "bad"],
    };
  },
  watch: {
    openPrevForm: function (val) {
      this.openPrevFormLayout = val;
      this.refreshData();
    },
    view360Form: function (val) {
      if (val) {
        this.openPrevFormLayout = true;
      }
    },
    reopen: function (val) {
      if (val) {
        this.refreshData();
      }
    },
  },
  created() {},
  methods: {
    onclosePrevTable() {
      this.openPrevFormLayout = false;
      this.$emit("closePrevTable");
    },
    submitPrevTable() {
      this.openPrevFormLayout = false;
      this.$emit("submitPrevTable");
    },
    getFeedbackColor(cell) {
      const color =
        cell?.rating == "" || cell?.value == "N/A"
          ? FeedbackPreviewColors.GREY
          : cell?.rating == this.feedbackCategories[0]
          ? FeedbackPreviewColors.GREEN
          : cell?.rating == this.feedbackCategories[1]
          ? FeedbackPreviewColors.YELLOW
          : cell?.rating == this.feedbackCategories[2]
          ? FeedbackPreviewColors.RED
          : "";
      return `background : ${color};`;
    },
    refreshData() {
      this.displayCategoryData = this.categoryData;
      this.displayTableData = [];
      this.userNames = [];

      for (let index = 0; index < this.displayCategoryData.length; index++) {
        const element = this.displayCategoryData[index];
        let preparedRow = {};
        for (let index1 = 0; index1 < this.tableData.length; index1++) {
          const element1 = this.tableData[index1];
          let answerArray = [];
          answerArray.push({
            field: "categoryName",
            value: element1.categoryName,
          });
          answerArray.push({
            field: "parameterName",
            value: element1.parameterName,
          });
          if (element._id == element1.category_id && element1?.parameterPrev) {
            element1?.parameterPrev?.forEach((it) => {
              it.answer =
                it.rating == "" || it.answer == "" ? "N/A" : it.answer;
              it.answer = "<span> " + it.answer + " </span>";
              answerArray.push({
                field: "rating",
                value: it.answer,
                rating: it.rating,
              });
              const userName = it.firstName + " " + it.lastName;
              !this.userNames.includes(userName)
                ? this.userNames.push(userName)
                : "";
            });
            preparedRow[element1?.parameterPrev[0]?.parameterName] =
              answerArray;
          }
        }
        this.displayTableData.push(preparedRow);
      }
    },
  },
};
</script>

<style scoped>
.prevTable {
  border-collapse: separate;
  border-spacing: 0;
}
.prevTable td,
th {
  border: 0.5px solid black;
  padding: 15px;
}

.prevTable th,
td {
  min-width: 175px;
}

.setTableWidth {
  overflow: auto;
  height: 260px;
}
.prevTable thead tr th {
  z-index: 3 !important;
  background: white;
}
.prevTable thead tr th:last-child {
  border-right: 2px solid black !important;
}
.prevTable thead tr:first-child th:first-child {
  z-index: 4 !important;
  left: 0px;
  position: sticky;
  background: white;
  border-left: 2px solid black !important;
}

.prevTable tbody tr td:first-child {
  z-index: 2 !important;
  left: 0px;
  position: sticky;
  background: white;
  border-left: 2px solid black !important;
}
.prevTable tbody tr td:nth-child(2) {
  z-index: 2 !important;
  left: 175px;
  position: sticky;
  background: white;
  /* border-right: 1.5px solid black !important; */
}

.prevTable tbody:last-child tr:last-child td {
  border-bottom: 2px solid black !important;
}
.prevTable tbody:last-child tr:nth-child(n-1) td:first-child {
  border-bottom: 2px solid black !important;
}
.prevTable tbody tr td:last-child {
  border-right: 2px solid black !important;
}
.prevTable tbody tr td {
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

.prevTable table th {
  border-top: 2px solid black !important;
}

.prevTableShadow .q-card {
  box-shadow: none;
}
</style>
