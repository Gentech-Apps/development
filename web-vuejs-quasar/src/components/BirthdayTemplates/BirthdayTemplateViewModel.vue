<template>
  <div>
    <q-dialog
      v-model="templateViewModel"
      :persistent="true"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      class="template-preview-model"
    >
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section class="shadow-3">
            <div
              class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center"
              data-id="templatepreview-heading"
            >
              {{ userName }}
            </div>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn
                v-if="!templateDatatoDisplay.isApproved"
                flat
                color="primary"
                label="Approve"
                type="submit"
                data-id="templatepreview-approve"
              />
              <q-btn
                v-if="!templateDatatoDisplay.isApproved"
                flat
                color="warning"
                label="Change Image"
                @click="changeImage"
                data-id="templatepreview-changeimage"
              />
              <q-btn
                v-if="!templateDatatoDisplay.isApproved"
                flat
                color="warning"
                label="Change Template"
                @click="changeTemplate"
              />
              <q-btn
                v-if="templateDatatoDisplay.isApproved"
                flat
                color="primary"
                label="Download"
                type="a"
                :href="
                  generatedBithdayTemplateImage(
                    templateDatatoDisplay.user._id,
                    templateDatatoDisplay.templates.birthdayWishesImage,
                  )
                "
                data-id="templatepreview-download"
              >
              </q-btn>
              <q-btn
                flat
                color="negative"
                label="Close"
                @click="closeModel"
                data-id="templatepreview-close"
              />
            </q-card-actions>
          </q-card-section>

          <div class="template-accordian" style="padding-top: 120px">
            <div
              v-if="!templateDatatoDisplay.isApproved"
              class="embed-responsive-item-main"
            >
              <div class="iframe_section">
                <iframe
                  class="embed-responsive-item"
                  :srcdoc="generatedBithdayTemplateHtml"
                  allowfullscreen
                  scrolling="no"
                  ref="myIframe"
                  @load="handleIframeLoad"
                >
                </iframe>
              </div>
              <div class="arrow_Section">
                <q-card-actions
                  class="embed-responsive-item-right"
                  align="left"
                >
                  <span
                    >Please use the direction pad or the arrows keys to adjust
                    the birthday image.</span
                  >
                  <div class="top-section">
                    <q-btn
                      flat
                      color="primary"
                      icon="keyboard_arrow_up"
                      @mousedown="startMoving('up')"
                      @mouseup="stopMoving"
                      @mouseleave="stopMoving"
                      data-id="templatepreview-uparrow"
                    />
                  </div>
                  <div class="mid-section">
                    <q-btn
                      flat
                      color="primary"
                      icon="keyboard_arrow_left"
                      @mousedown="startMoving('left')"
                      @mouseup="stopMoving"
                      @mouseleave="stopMoving"
                      data-id="templatepreview-leftarrow"
                    />
                    <q-btn
                      flat
                      class="reset-button"
                      icon="open_with"
                      color="primary"
                      @click="position('reset')"
                      data-id="templatepreview-resetbutton"
                    />
                    <q-btn
                      flat
                      color="primary"
                      icon="keyboard_arrow_right"
                      @mousedown="startMoving('right')"
                      @mouseup="stopMoving"
                      @mouseleave="stopMoving"
                      data-id="templatepreview-rightarrow"
                    />
                  </div>
                  <div class="bottom-section">
                    <q-btn
                      flat
                      color="primary"
                      icon="keyboard_arrow_down"
                      @mousedown="startMoving('down')"
                      @mouseup="stopMoving"
                      @mouseleave="stopMoving"
                      data-id="templatepreview-downarrow"
                    />
                  </div>
                </q-card-actions>
              </div>
            </div>
            <div class="template-image" v-if="templateDatatoDisplay.isApproved">
              <img
                class="embed-responsive-image"
                :src="
                  generatedBithdayTemplateImage(
                    templateDatatoDisplay.user._id,
                    this.templateDatatoDisplay.templates.birthdayWishesImage,
                  )
                "
                allowfullscreen
                scrolling="no"
              />
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>

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
            Invalid data
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errMsg }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            color="negative"
            label="OK"
            @click="errorLayout = false"
            data-id="templatepreviewerror-ok"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import Notify from "../../components/Notify.vue";
import * as userService from "../../services/users.service";

export default {
  components: {
    Notify,
  },
  data() {
    return {
      templateViewModel: false,
      templateDatatoDisplay: {},
      maximizedToggle: true,
      errorLayout: false,
      errMsg: "",
      successMsg: "",
      generatedBithdayTemplateHtml: "",
      imageCoordinateXValue: "0",
      imageCoordinateYValue: "0",
      intervalId: null,
      direction: "",
    };
  },
  props: ["layout", "data"],
  watch: {
    layout: async function (newVal) {
      this.templateViewModel = newVal;
      if (newVal) {
        document.getElementById("main-layout-logo").style.zIndex = "999";
        this.$q.loading.show();
        if (!this.templateDatatoDisplay.isApproved) {
          await this.generatedBirthdayTemplateHtml();
        }
        setTimeout(() => {
          this.$q.loading.hide();
        }, 1500);
      }
    },
    data: {
      immediate: true,
      handler: function (val) {
        this.templateDatatoDisplay = {};
        this.templateDatatoDisplay = val;
      },
    },
  },
  computed: {
    userName() {
      return (
        this.templateDatatoDisplay.user.firstName.trim() +
        " " +
        this.templateDatatoDisplay.user.lastName.trim() +
        "'s Templates Preview"
      );
    },
  },
  methods: {
    handleIframeLoad() {
      this.$q.loading.show();
      const iframe = this.$refs.myIframe;
      if (
        iframe.contentDocument &&
        iframe.contentDocument.readyState === "complete"
      ) {
        const circleWrapper =
          iframe.contentDocument.querySelector(".circle-wrapper");
        if (circleWrapper) {
          const img = circleWrapper.querySelector("img"); // Get the img tag within circleWrapper

          // Check if img tag is already loaded
          if (img) {
            if (img.complete) {
              this.afterLoading();
            } else {
              img.onload = () => {
                this.afterLoading();
              };
              img.onerror = () => {
                console.log("Error loading image");
                window.setTimeout(this.handleIframeLoad.bind(this), 200);
              };
            }
          } else {
            console.log("Image not Avialable");
            window.setTimeout(this.handleIframeLoad.bind(this), 200);
          }
        } else {
          console.log("Circle wrapper not found in iframe");
          window.setTimeout(this.handleIframeLoad.bind(this), 200);
        }
      } else {
        console.log("Iframe not Loaded");
        window.setTimeout(this.handleIframeLoad.bind(this), 200);
      }

      // Set the height of the iframe to match the height of the content
      const iframeDimension =
        this.templateDatatoDisplay.templates.sourceTemplateName
          .split("-")[1]
          .split(".")[0]
          .split("*");
      iframe.style.width = `${iframeDimension[0]}px`;
      iframe.style.height = `${iframeDimension[1]}px`;
    },
    afterLoading() {
      this.$q.loading.hide();
      console.log("Image is loaded.");
    },
    startMoving(direction) {
      this.direction = direction;
      this.intervalId = setInterval(this.move, 10);
    },
    move() {
      this.position(this.direction);
    },
    stopMoving() {
      clearInterval(this.intervalId);
    },
    handleKeyDown(event) {
      if (event.keyCode === 37) {
        this.position("left");
      } else if (event.keyCode === 38) {
        this.position("up");
      } else if (event.keyCode === 39) {
        this.position("right");
      } else if (event.keyCode === 40) {
        this.position("down");
      }
    },
    position(value) {
      const iframe = this.$refs.myIframe;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      let ele = iframeDocument.querySelector(".circle-wrapper img");
      let css_obj = window.getComputedStyle(ele);
      this.imageCoordinateXValue = parseInt(
        css_obj.getPropertyValue("left").replace("px", ""),
      );
      this.imageCoordinateYValue = parseInt(
        css_obj.getPropertyValue("top").replace("px", ""),
      );

      switch (value) {
        case "up":
          this.imageCoordinateYValue--;
          ele.style["top"] = this.imageCoordinateYValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateYValue =
            this.imageCoordinateYValue + "px";
          break;
        case "down":
          this.imageCoordinateYValue++;
          ele.style["top"] = this.imageCoordinateYValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateYValue =
            this.imageCoordinateYValue + "px";
          break;
        case "left":
          this.imageCoordinateXValue--;
          ele.style["left"] = this.imageCoordinateXValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateXValue =
            this.imageCoordinateXValue + "px";
          break;
        case "right":
          this.imageCoordinateXValue++;
          ele.style["left"] = this.imageCoordinateXValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateXValue =
            this.imageCoordinateXValue + "px";
          break;
        case "reset":
          this.imageCoordinateXValue = 0;
          this.imageCoordinateYValue = 0;
          ele.style["left"] = this.imageCoordinateXValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateXValue =
            this.imageCoordinateXValue + "px";
          ele.style["top"] = this.imageCoordinateYValue + "px";
          this.templateDatatoDisplay.templates.imageCoordinateYValue =
            this.imageCoordinateYValue + "px";
          break;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    generatedBithdayTemplateImage(userId, fileName) {
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const REGION = process.env.REGION;
      const ENV = process.env.ENV;
      return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${ENV}/${userId}/birthdayWishesImage/${fileName}`;
    },
    async generatedBirthdayTemplateHtml() {
      this.$q.loading.show();
      const result = await userService.generateBirthdayTemplate(
        this.templateDatatoDisplay,
      );
      if (result.data.ok) {
        this.generatedBithdayTemplateHtml =
          result.data.generatedBirthdayTemplateHtml;
        this.templateDatatoDisplay = result.data.updatedBirthdayTemplateData;
        this.errMsg = "";
        this.errorLayout = false;
      } else {
        this.errMsg = result.data.message;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
    confirmBox() {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Can we go with this template?",
          cancel: true,
          persistent: true,
          ok: "Yes",
          cancel: {
            color: "negative",
            label: "No",
            flat: true,
          },
        })
        .onOk(() => {
          this.onApprovedBirthdayTemplate();
        })
        .onCancel(() => {
          return false;
        });
    },
    onSubmit() {
      if (this.templateDatatoDisplay.templates.length <= 0) {
        this.errMsg = "At least one template should be select.";
        this.errorLayout = true;
      } else {
        this.confirmBox();
      }
    },
    async onApprovedBirthdayTemplate() {
      this.$q.loading.show();
      const result = await userService.onApprovedBirthdayTemplate(
        this.templateDatatoDisplay,
      );
      if (result.data.ok) {
        this.$emit("onApproved", result.data.message);
        this.closeModel();
      } else {
        this.errMsg = result.data.message;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
    closeModel() {
      this.generatedBithdayTemplateHtml = "";
      this.$emit("close");
      document.getElementById("main-layout-logo").style.zIndex = "999999";
    },
    async changeTemplate() {
      this.$q.loading.show();
      const result = await userService.changeHtmlBirthdayTemplate(
        this.templateDatatoDisplay,
      );
      if (result.data.ok) {
        this.templateDatatoDisplay = result.data.templateData;
        this.generatedBithdayTemplateHtml = "";
        await this.generatedBirthdayTemplateHtml();
        this.successMsg = result.data.message;
      } else {
        this.errMsg = result.data.message;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
    async changeImage() {
      this.$q.loading.show();
      const result = await userService.changeImageBirthdayTemplate(
        this.templateDatatoDisplay,
      );
      if (result.data.ok) {
        this.templateDatatoDisplay = result.data.templateData;
        this.generatedBithdayTemplateHtml = "";
        await this.generatedBirthdayTemplateHtml();
        this.successMsg = result.data.message;
      } else {
        this.errMsg = result.data.message;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
};
</script>

<style>
.template-preview-model .template-accordian .q-expansion-item {
  margin: 20px !important;
}
.template-preview-model .q-list--bordered {
  border: none !important;
}
.template-preview-model .q-focus-helper:after {
  background: none !important;
}
.template-image {
  width: 650px;
  margin: auto;
}
.template-preview-model .shadow-3 {
  position: fixed;
  color: red;
  width: -webkit-fill-available;
  z-index: 99;
  background-color: #ffffff;
  margin-top: 0px;
}

.embed-responsive-item-main {
  display: flex;
  padding: 30px;
}

.template-preview-model .embed-responsive-item {
  width: 100%;
  border: unset;
  overflow: hidden;
  background: none;
}

.template-preview-model .embed-responsive-image {
  border: unset;
  height: auto;
  overflow: hidden;
  background: none;
}

.embed-responsive-item-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  text-align: center;
  position: fixed;
  justify-content: center;
  margin-top: 5%;
}

.embed-responsive-item-right button.q-btn {
  background: #ebede6;
  margin: 4px;
  width: 50px;
}
.embed-responsive-item-right .top-section button.q-btn {
  border-radius: 20px 20px 5px 5px;
}
.embed-responsive-item-right .mid-section button.q-btn.text-primary:last-child {
  border-radius: 5px 20px 20px 5px;
}
.embed-responsive-item-right .mid-section button.q-btn.text-primary {
  border-radius: 20px 5px 5px 20px;
}
.bottom-section button.q-btn {
  border-radius: 5px 5px 20px 20px;
}
.embed-responsive-item-right > span {
  margin-bottom: 20px;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
}
button.q-btn.reset-button {
  border-radius: 10px !important;
}

.arrow_Section {
  width: 50%;
  margin: 0 auto;
  padding-left: 10%;
}
.iframe_section {
  width: 50%;
  margin: 0 auto;
  display: table;
}

.iframe_section iframe.embed-responsive-item {
  width: 650px;
  height: 750px;
}
</style>
