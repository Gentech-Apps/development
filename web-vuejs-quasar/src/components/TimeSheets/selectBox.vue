<template>
  <div>
    <q-select
      outlined
      use-input
      multiple
      popup-content-class="filter-w-checkbox rei-filter-content"
      :options="model"
      v-model="selector"
      label="Selector"
      class="col-grow q-py-none q-pr-none skill-selector"
      behavior="menu"
      emit-value
      map-options
    >
      <template v-slot:append v-if="groupSelected.length > 0">
        <span class="single-fltr-sel-clear">
          <q-icon
            name="clear"
            class="cursor-pointer"
            style="font-size: 16px"
            @click="clearSingleFilter"
          />
        </span>
      </template>
      <span>
        {{ selectedString }}
      </span>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" class="byproject-selection">
          <q-item-section side class="full-width q-pr-none">
            <q-list class="full-width">
              <q-item :key="scope.opt.id">
                <!-- {{ scope.opt }} -->
                <div class="row col-12">
                  <div class="col-auto">
                    <q-checkbox
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
    <!-- {{ model }} -->
  </div>
</template>
<script>
import * as projectsService from "../TimeSheets../../../services/projects.service";

export default {
  name: "SelectorBox",
  data() {
    return {
      selectedString: "No Selected",
      groupSelected: [],
      selector: [],
      model: [
        {
          label: "Person",
          id: 1,
          checked: false,
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
  watch: {
    model: {
      handler: function (val) {
        this.groupSelected = [];
        val.forEach((parentData) => {
          if (parentData.checked) {
            this.groupSelected.push({
              clientId: parentData.id,
              clientName: parentData.label,
              project: [],
            });
            parentData.options.forEach((childData) => {
              if (childData.checked) {
                this.groupSelected.project.push({
                  projectId: childData.id,
                  projectName: childData.name,
                });
              }
            });
          }
        });
        this.$emit("selectedBox", this.listData);
      },
      deep: true,
    },
  },
  methods: {
    selectManage(val) {
      val.forEach((optn) => {
        optn.options.forEach((child) => {
          if (child.checked) {
            optn.checked = true;
          }
        });
      });
    },
    selectGroup(val, idx) {
      this.Subgroup(val, idx);
    },
    Subgroup(obj, idx) {
      if (obj.checked) {
        this.model[idx].options.forEach((optn) => {
          optn.checked = true;
        });
      } else {
        this.model[idx].options.forEach((optn) => {
          optn.checked = false;
        });
      }
      this.onDisplaySelected();
    },
    selectSubGroup(val, pval, idx, pindex) {
      if (val.checked) {
        this.model[pindex].checked = true;
      } else {
        this.model[pindex].checked = false;
      }
      this.onDisplaySelected();
    },

    rearrangeGroupSelected(selectedObject, index) {
      if (
        this.groupSelected.length > 0 &&
        this.groupSelected !== selectedObject
      )
        var arr = [];
      this.model[index].options.forEach((ele) => {
        arr.push(ele.id);
      });

      this.model[index].checked = true;
      this.model[index].options.forEach((row) => {
        row.checked = this.model[index].checked;
        if (row.checked) {
          if (this.groupSelected.options.length > 0) {
            this.groupSelected.options.push(row.id);
          } else {
            this.groupSelected.push({
              id: selectedObject.id,
              options: [row.id],
              checked: true,
            });
          }
        }
      });
      return false;
    },

    clearSingleFilter() {
      this.model.forEach((project) => {
        project.checked = false;
        project.options.forEach((option) => {
          option.checked = false;
        });
      });
      this.groupSelected = { id: "", options: [], names: [], parent: "" };
      this.selectedString = "No Selected";
      this.$forceUpdate();
      this.getUserList();
    },
    async getAllProjectsWithClients() {
      const response = await projectsService.fetchAllClientsProjects();
      this.model = [];
      response.data.forEach((data) => {
        data.projects.forEach((project, index) => {
          if (index == 0) {
            this.model.push({
              label: data.clientId.name,
              id: data.clientId._id,
              checked: false,
              options: [
                {
                  id: project.projectId,
                  name: project.projectName,
                  checked: false,
                },
              ],
            });
          } else {
            this.model[index].options.push({
              id: project.projectId,
              name: project.projectName,
              checked: false,
            });
          }
        });
      });
    },
  },
  async mounted() {
    await this.getAllProjectsWithClients();
  },
};
</script>

<style>
.skill-selector .q-field__label {
  display: none;
}
.skill-selector .q-field__control-container {
  padding-top: 12px !important;
}
.skill-selector .q-field__native {
  display: none;
}
</style>
