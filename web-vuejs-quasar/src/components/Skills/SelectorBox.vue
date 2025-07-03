<template>
  <div>
    <q-select
      outlined
      use-input
      use-chips
      multiple
      popup-content-class="filter-w-checkbox rei-filter-content"
      :options="model"
      v-model="selector"
      label="Please Select a Parameter"
      class="col-grow q-py-none q-pr-none skill-selector"
      :class="selectedString == '' ? '' : 'skill-selector-label'"
      behavior="menu"
      emit-value
      map-options
      style="background-color: #fff"
    >
      <template v-slot:append v-if="groupSelected.options.length > 0">
        <span class="single-fltr-sel-clear">
          <q-icon
            name="clear"
            class="cursor-pointer"
            style="font-size: 16px"
            @click="clearSingleFilter"
          />
        </span>
      </template>
      <span
        class="scroll"
        style="max-width: 50vw; line-height: 1; padding-top: 12px"
      >
        {{ selectedString }}
      </span>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" class="byproject-selection">
          <q-item-section side class="full-width q-pr-none">
            <q-list class="full-width">
              <q-item :key="scope.opt.id">
                <div class="row col-12">
                  <div class="col-auto">
                    <q-checkbox
                      id="parentCheck"
                      v-model="model[scope.index].checked"
                      @update:model-value="selectGroup(scope.opt, scope.index)"
                    />
                  </div>
                  <div class="col-grow">
                    <q-expansion-item expand-separator :label="scope.opt.label">
                      <q-list>
                        <q-item
                          v-for="(dept, indexDeptId) in scope.opt.options"
                          :key="indexDeptId"
                          class="full-width"
                        >
                          <q-checkbox
                            class="full-width"
                            :label="dept.name"
                            v-model="
                              model[scope.index].options[indexDeptId].checked
                            "
                            @update:model-value="
                              selectSubGroup(
                                dept,
                                scope.opt,
                                indexDeptId,
                                scope.index,
                              )
                            "
                          />
                        </q-item>
                      </q-list>
                    </q-expansion-item>
                  </div>
                </div>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import * as skillRatingsService from "../../services/skillRatings.service";
import * as departmentsService from "../../services/departments.service";
import * as skillDepartmentService from "../../services/skillDepartment.service";
import * as usersService from "../../services/users.service";

export default {
  name: "SelectorBox",
  data() {
    return {
      selectedString: "",
      parentObj: "",
      groupSelected: { id: "", options: [], names: [], parent: "" },
      selector: [],
      listData: [],
      model: [
        {
          label: "Person",
          id: 1,
          checked: true,
          options: [],
        },
        {
          label: "Skills",
          id: 2,
          checked: false,
          options: [],
        },
      ],
    };
  },
  methods: {
    async getUserList() {
      var pId = 100;

      this.listData = [];
      if (this.groupSelected.id == 0) {
        const response = await usersService.fetchUsers();
        response.data.forEach((user) => {
          user.departments.forEach((dept) => {
            if (this.groupSelected.options.includes(dept._id)) {
              var found;
              if (this.listData.length > 0)
                found = this.listData.some((list) => list.id === user._id);
              else found = false;
              if (!found) {
                this.listData.push({
                  fname: user.firstName,
                  lname: user.lastName,
                  id: user._id,
                });
                pId = 0;
              }
            }
          });
        });
      }
      if (this.groupSelected.id == 1) {
        const response = await skillRatingsService.fetchAllSkills();

        this.groupSelected.options.forEach((pskill, index) => {
          response.data.forEach((skill) => {
            if (skill.department._id == pskill) {
              this.listData.push({
                fname: skill.name,
                lname: "",
                id: skill._id,
              });
            }
          });
        });

        pId = 1;
      }
      this.$emit("selectedBox", this.listData);

      this.$emit("parentId", pId);
    },
    selectGroup(val, idx) {
      this.rearrangeGroupSelected(val);
      if (this.model[idx].checked) {
        this.groupSelected.id = idx;
        this.groupSelected.parent = val.label;
      } else {
        this.groupSelected = { id: "", options: [], names: [], parent: "" };
      }

      this.model[idx].options.forEach((row) => {
        row.checked = this.model[idx].checked;

        if (row.checked) {
          this.groupSelected.options.push(row.id);
          this.groupSelected.names.push(row.name);
        }
      });
      this.$forceUpdate();
      this.onDisplaySelected();
      this.getUserList();
    },
    rearrangeGroupSelected(selectedObject) {
      if (
        this.groupSelected.id !== "" &&
        this.groupSelected.id !== selectedObject
      ) {
        this.model[this.groupSelected.id].checked = false;
        this.model[this.groupSelected.id].options.forEach((row) => {
          row.checked = this.model[this.groupSelected.id].checked;
          if (row.checked) {
            this.groupSelected.options.push(row.id);
            this.groupSelected.names.push(row.name);
          }
        });
        this.groupSelected = { id: "", options: [], names: [], parent: "" };
      }
    },
    selectSubGroup(val, pval, idx, pindex) {
      this.rearrangeGroupSelected(pindex);
      this.groupSelected.id = pindex;
      this.groupSelected.parent = pval.label;
      if (!this.model[pindex].options[idx].checked) {
        var index = this.groupSelected.options.indexOf(val.id);
        this.groupSelected.options.splice(index, 1);

        var indexOfName = this.groupSelected.names.indexOf(val.name);
        this.groupSelected.names.splice(indexOfName, 1);

        if (this.groupSelected.options.length === 0) {
          this.model[pindex].checked = false;
          this.groupSelected.id = "";
          this.groupSelected.parent = "";
          this.selectedString = "";
        }
      } else {
        this.model[pindex].checked = true;
        this.groupSelected.options.push(val.id);
        this.groupSelected.names.push(val.name);
      }
      this.$forceUpdate();
      this.onDisplaySelected();

      this.getUserList();
    },
    clearSingleFilter() {
      this.model.forEach((project) => {
        project.checked = false;
        project.options.forEach((option) => {
          option.checked = false;
        });
      });
      this.groupSelected = { id: "", options: [], names: [], parent: "" };
      this.selectedString = "";
      this.$forceUpdate();
      this.getUserList();
    },
    onDisplaySelected() {
      this.selectedString = "";
      if (this.groupSelected.options.length !== 0) {
        this.selectedString = this.groupSelected.names.join(", ");
      }
    },
    async getAllSkillDepartments() {
      const response = await skillDepartmentService.fetchAllSkillDepartments();
      this.model[1].options = [];
      response.data.forEach((skillDept) => {
        this.model[1].options.push({
          id: skillDept._id,
          name: skillDept.name,
          checked: false,
        });
      });
    },
    async getAllDepartments() {
      this.parentObj = { label: "Person", id: 1, checked: true, options: [] };
      const response = await departmentsService.fetchAllDepartment();
      this.model[0].options = [];
      response.data.forEach((department) => {
        this.model[0].options.push({
          id: department._id,
          name: department.name,
          checked: false,
        });
        this.parentObj.options.push({
          id: department._id,
          name: department.name,
          checked: false,
        });
      });
      this.selectGroup(this.parentObj, 0);
    },
  },

  mounted() {
    this.getAllSkillDepartments();
    this.getAllDepartments();
  },
};
</script>

<style>
.skill-selector-label .q-field__label {
  transform: translateY(-15px);
  font-size: 12px;
}
.skill-selector .q-field__control-container {
  padding-top: 12px !important;
}
.skill-selector .q-field__native {
  display: none;
}
</style>
