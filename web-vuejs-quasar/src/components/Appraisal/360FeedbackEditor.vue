<template>
  <q-dialog :persistent="true" v-model="openEditor">
    <q-card class="q-py-sm feedback-editor">
      <q-form>
        <div>
          <q-card-section>
            <div class="row">
              <div
                class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-md feedback-style text-capitalize"
              >
                <div class="feedback-data">{{ feedbackData.category }}</div>
                <div class="feedback-data">{{ feedbackData.parameter }}</div>
                <div class="feedback-ratings-data">
                  <label
                    v-for="option in ratingOptions"
                    :key="option.value"
                    class="rating-label"
                  >
                    <input
                      type="radio"
                      v-model="feedbackData.rating"
                      :value="option.value"
                      name="radioButtonGroup"
                    />
                    {{ option.label }}
                  </label>
                </div>
              </div>
              <div class="edit-profile-rows">
                <q-editor
                  class="editor-style"
                  v-model="description"
                  style="margin-left: 20px"
                  :dense="$q.screen.lt.lg"
                  :toolbar="[
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                      'subscript',
                      'superscript',
                    ],
                    ['token', 'hr', 'link', 'custom_btn'],

                    [
                      {
                        label: $q.lang.editor.formatting,
                        icon: $q.iconSet.editor.formatting,
                        list: 'no-icons',
                      },
                      {
                        icon: $q.iconSet.editor.fontSize,
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'size-1',
                          'size-2',
                          'size-3',
                          'size-4',
                          'size-5',
                          'size-6',
                          'size-7',
                        ],
                      },
                    ],
                  ]"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="justify-end">
            <q-btn
              flat
              label="Reset"
              color="warning"
              @click="resetData"
              data-id="360feedbackcomment-resetbutton"
              :disabled="
                feedbackData.rating == '' || feedbackData?.feedback == ''
              "
            />
            <q-btn
              color="negative"
              flat
              v-close-popup
              label="Cancel"
              @click="closeEditor"
              data-id="360feedbackcomment-cancelbutton"
            />
            <q-btn
              flat
              @click="saveFeedback"
              color="primary"
              label="Save"
              :disabled="feedbackData.rating === '' || !isEditorContentValid()"
              data-id="360feedbackcomment-submitbutton"
            />
          </q-card-actions>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  FeedbackRatings,
  HTMLTagsRemovalRegex,
} from "../../constants/appraisalConstants";

export default {
  props: ["editorLayout", "feedbackData"],
  data() {
    return {
      openEditor: false,
      description: null,
      ratingOptions: [
        { value: FeedbackRatings.GOOD, label: "Good" },
        { value: FeedbackRatings.AVERAGE, label: "Average" },
        { value: FeedbackRatings.BAD, label: "Bad" },
      ],
    };
  },
  methods: {
    closeEditor() {
      this.$emit("closeEditor");
    },
    resetData() {
      this.description = null;
      this.feedbackData.rating = "";
      const data = {
        cellId: this.feedbackData.cellId,
        description: this.description?.trim(),
        rating: this.feedbackData?.rating,
      };
      this.$emit("saveFeedback", data);
    },
    saveFeedback() {
      const data = {
        cellId: this.feedbackData.cellId,
        description: this.description.trim(),
        rating: this.feedbackData.rating,
      };
      this.$emit("saveFeedback", data);
    },
    isEditorContentValid() {
      const textContent = this.description
        ?.replace(HTMLTagsRemovalRegex.REMOVE_HTML_TAGS, "")
        ?.trim();
      return textContent?.length > 0;
    },
  },
  watch: {
    editorLayout: function (val) {
      this.openEditor = val;
      this.description = this.feedbackData?.feedback;
    },
  },
};
</script>

<style scoped>
.feedback-style {
  display: flex;
  justify-content: space-evenly;
}
.feedback-data {
  padding-inline: 15px;
  font-size: 15px;
}
.edit-profile-rows {
  height: max-content;
  width: 100%;
}
.feedback-ratings-data {
  display: flex;
  gap: 15px;
}
.rating-label {
  font-size: 15px;
  display: flex;
  gap: 2px;
}
.feedback-editor {
  width: 80vw !important;
}
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}
</style>
