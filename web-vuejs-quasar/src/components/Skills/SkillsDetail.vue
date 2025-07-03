<template>
  <div class="row">
    <template v-if="pId == 0"
      ><div v-for="(title, index) in skillTitle">
        <div class="col-4" :key="index">
          <q-item-label class="q-mt-none text-h6 text-weight-medium text-dark">
            {{ title }}
          </q-item-label>
        </div>
      </div></template
    >
    <template v-if="pId == 1"
      ><div v-for="(title, index) in userTitle">
        <div class="col-4" :key="index">
          <q-item-label
            class="q-mt-none text-h6 text-weight-medium text-dark q-pl-xl"
          >
            {{ title }}
          </q-item-label>
        </div>
      </div></template
    >

    <div class="col-12">
      <q-list>
        <div class="overflow-auto scroll-area skill-detail-box q-py-sm q-mt-sm">
          <div
            class="text-left text-subtitle1 text-weight-medium text-dark"
            v-for="skill in skillWithDept"
            :key="skill.id"
          >
            <q-item class="q-pt-md" clickable v-ripple>
              <div class="col-4">
                <q-item-label class="q-mt-none">{{ skill.name }}</q-item-label>
              </div>
              <div class="col-4">
                <q-item-label class="q-mt-none">
                  <q-rating
                    v-model="skill.rating"
                    size="1.6em"
                    :max="10"
                    color="grey"
                    icon="star_border"
                    icon-selected="star"
                    @update:model-value="setSkillRating(skill.id, skill.rating)"
                    no-dimming
                    :color-selected="ratingColors"
                  >
                    <template v-slot:tip-1>
                      <q-tooltip>1 New to technology</q-tooltip>
                    </template>
                    <template v-slot:tip-2>
                      <q-tooltip>2</q-tooltip>
                    </template>
                    <template v-slot:tip-3>
                      <q-tooltip>3</q-tooltip>
                    </template>
                    <template v-slot:tip-4>
                      <q-tooltip>4</q-tooltip>
                    </template>
                    <template v-slot:tip-5>
                      <q-tooltip>5 Can do the assigned work</q-tooltip>
                    </template>
                    <template v-slot:tip-6>
                      <q-tooltip>6</q-tooltip>
                    </template>
                    <template v-slot:tip-7>
                      <q-tooltip>7</q-tooltip>
                    </template>
                    <template v-slot:tip-8>
                      <q-tooltip>8</q-tooltip>
                    </template>
                    <template v-slot:tip-9>
                      <q-tooltip>9</q-tooltip>
                    </template>
                    <template v-slot:tip-10>
                      <q-tooltip>10 He/She wil get it done</q-tooltip>
                    </template>
                  </q-rating>
                </q-item-label>
              </div>
              <div class="col-4 q-pl-sm">
                <q-item-label class="q-mt-none q-pl-xl">{{
                  skill.deptName
                }}</q-item-label>
              </div>
            </q-item>
            <q-separator class="q-mx-auto change-skill-detail-separator" />
          </div>
        </div>
      </q-list>
    </div>
  </div>
</template>
<script>
import * as skillRatingsService from "../../services/skillRatings.service";

export default {
  name: "SkillsDetail",
  data() {
    return {
      skillData: [
        {
          id: "1",
          label: "Rahul Holani",
          rate: 9,
          department: "Development",
        },
        {
          id: "2",
          label: "Shrikant Jaiswal",
          rate: 4,
          department: "Development",
        },
        {
          id: "3",
          label: "Tarun Khaturiya",
          rate: 9,
          department: "BDE",
        },
        {
          id: "4",
          label: "Neraj Patel",
          rate: 10,
          department: "Development",
        },
        {
          id: "5",
          label: "Ankit Parmar",
          rate: 6,
          department: "Development",
        },
        {
          id: "6",
          label: "Shivangee Gupta",
          rate: 5,
          department: "Development",
        },
        {
          id: "7",
          label: "Sourabh Sen",
          rate: 1,
          department: "BDE",
        },
        {
          id: "8",
          label: "Rishabh Songirkar",
          rate: 8,
          department: "Development",
        },
      ],
      ratingColors: [
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
      ],
      skillTitle: ["Skill", "Rating"],
      userTitle: ["Name", "Rating", "Department"],
      skillWithDept: [],
      skill: [],
    };
  },
  methods: {
    getRole() {
      if (this.$store.getters.mentees.includes(this.userId)) {
        return "mentor";
      } else if (this.$store.getters.userId == this.userId) {
        return "self";
      } else {
        if (this.$store.getters.userType == "manager") {
          return "manager";
        } else {
          return "peer";
        }
      }
    },
    async setSkillRating(skillId, rating) {
      let role = this.getRole();
      let requestData = [];
      if (this.pId == 0) {
        requestData = [
          {
            to: this.userId,
            from: this.$store.getters.userId,
            rating: rating,
            role: role,
            skill: skillId,
          },
        ];
      }
      if (this.pId == 1) {
        requestData = [
          {
            to: skillId,
            from: this.$store.getters.userId,
            rating: rating,
            role: role,
            skill: this.userId,
          },
        ];
      }
      await skillRatingsService.addSkillsRating(requestData);
    },
    async getRatingByUser(userId, pId) {
      this.skillWithDept = [];
      if (pId == 0) {
        const response = await skillRatingsService.fetchAllRatingByUser(userId);
        const response1 =
          await skillRatingsService.fetchRatingsGivenByUserToUser(
            userId,
            this.$store.getters.userId,
          );

        response.data.forEach((skillRat) => {
          var getSkill = true;
          response1.data.forEach((rateByUser) => {
            if (skillRat.id == rateByUser.skill._id) {
              getSkill = false;
              this.skillWithDept.push({
                id: skillRat.id,
                name: skillRat.skill,
                rating: rateByUser.rating,
              });
            }
          });
          if (getSkill) {
            this.skillWithDept.push({
              id: skillRat.id,
              name: skillRat.skill,
              rating: 0,
            });
          }
        });
      }

      if (pId == 1) {
        const response =
          await skillRatingsService.fetchRatingsGivenByUserBySkill(
            this.$store.getters.userId,
            this.userId,
          );

        response.data.forEach((skillRat) => {
          var d = "";
          skillRat.to.departments.forEach((dept, index) => {
            if (index == 0) {
              d = d + "" + dept.name;
            } else {
              d = d + ", " + dept.name;
            }
          });
          this.skillWithDept.push({
            id: skillRat.to._id,
            name: skillRat.to.firstName + " " + skillRat.to.lastName,
            rating: skillRat.rating,
            deptName: d,
          });
        });
      }
    },
  },
  props: ["userId", "pId"],
  watch: {
    userId: async function (value) {
      this.$q.loading.show();
      await this.getRatingByUser(value, this.pId);
      this.$q.loading.hide();
    },
    pId: function (value) {
      this.skillWithDept = [];
    },
  },
};
</script>

<style>
.skill-detail-box {
  border: 2px solid #dadada;
  outline: none;
  height: 404px;
}
.change-skill-detail-separator {
  width: 95%;
}
.q-mt-none {
  margin-top: 0 !important;
}
</style>
