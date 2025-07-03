<template>
  <div class="capitalize">
    <q-select
      dense
      input-debounce="0"
      outlined
      fill-input
      multiple
      use-chips
      v-model="selectedData"
      :options="optionProjects"
      label="Project"
      use-input
      @filter="filterFn"
      data-id="addtimesheet-selectproject"
    >
      <template v-slot:option="scope">
        <div class="row col-12">
          <div class="col-12 add-timesheet-select-project capitalize">
            <q-checkbox
              v-model="optionProjects[scope.index].checked"
              @update:model-value="selectGroup(scope.opt, scope.index)"
              :label="optionProjects[scope.index].label"
            />
          </div>
        </div>
      </template>
    </q-select>
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
      project: [],
      selectedData: [],
      selected: null,
      projectOptions: [],
      optionProjects: [],
    };
  },
  watch: {
    selectedData: {
      handler: function (newValue) {
        var b = true;
        this.optionProjects.forEach((opdata, index) => {
          newValue.forEach((sdata) => {
            if (opdata.value == sdata.value) {
              b = false;
            }
          });
          if (b) {
            this.optionProjects[index].checked = false;
          }
          b = true;
        });
      },
      deep: true,
    },
    projectOptions: {
      handler: function (newValue) {
        var sendProjects = [];

        newValue.forEach((val) => {
          if (val.checked) {
            sendProjects.push(val);
          }
        });
        this.$emit("projects", sendProjects);
        document.querySelector('input[type="search"]').focus();
      },
      deep: true,
    },
  },
  methods: {
    toggleOption(opt) {},
    selectGroup(obj, idx) {
      if (obj.checked) {
        obj.checked = true;
        this.selectedData.push(obj);
      } else {
        obj.checked = false;
        var str = this.selectedData.indexOf(obj);
        this.selectedData.splice(str, 1);
      }
    },

    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.optionProjects = this.projectOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionProjects = [];
        this.projectOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionProjects.push(option);
          }
        });
      });
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
    onDisplaySelected() {
      this.selectedString = "No Selected";
      if (this.groupSelected.options.length !== 0) {
        this.selectedString =
          this.groupSelected.parent +
          ": [" +
          this.groupSelected.names.join() +
          "]";
      }
    },
    async getAllProjects() {
      this.projectOptions = [];
      var res = await projectsService.getMyProject(this.$store.getters.userId);
      res.data[0].clientsAndProjects.forEach((clientProject) => {
        if (clientProject.client.isActive) {
          clientProject.projects.forEach((project) => {
            if (project.isActive) {
              this.projectOptions.push({
                value: project._id,
                label: project.name + " (" + clientProject?.client?.name + ")",
                checked: false,
              });
            }
          });
        }
      });

      this.projectOptions.sort((a, b) => {
        if (a.label.trim() < b.label.trim())
          //sort string ascending
          return -1;
        if (a.label.trim() > b.label.trim()) return 1;
        return 0;
      });

      this.optionProjects = this.projectOptions;

      this.projectOptions.forEach((project) => {
        const projectLabel = project?.label
          ?.split("(")[0]
          ?.trim()
          ?.toLowerCase();
        if (
          this.gotProject?.some((item) =>
            item.toLowerCase().includes(projectLabel),
          )
        ) {
          project.checked = true;
          this.selectedData.push(project);
        }
      });
    },
  },

  async mounted() {
    await this.getAllProjects();
  },
  props: {
    gotProject: {
      default: () => [],
    },
  },
};
</script>

<style>
.add-timesheet-select-project .q-checkbox {
  width: 100% !important;
}
.capitalize {
  text-transform: capitalize;
}
</style>
