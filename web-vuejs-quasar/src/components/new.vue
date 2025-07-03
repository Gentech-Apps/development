<template>
  <div>
    <div class="q-pa-md q-gutter-sm" style="position: relative">
      <q-btn label="Add Events" color="primary" @click="layout = true" />

      <q-dialog
        v-model="layout"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-layout view="Lhh lpR fff" container class="bg-white">
          <q-drawer
            bordered
            v-model="drawer"
            :width="50"
            :breakpoint="600"
            content-class="bg-grey-3 q-pa-sm"
          >
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </q-drawer>

          <q-drawer
            side="right"
            bordered
            v-model="drawerR"
            :width="200"
            :breakpoint="300"
            content-class="bg-grey-3 q-pa-sm"
          >
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </q-drawer>

          <div class="q-pa-md">
            <div class="q-gutter-md" style="max-width: 300px">
              <div>
                <q-lable>Event Name</q-lable>
                <q-input outlined v-model="text" label="Event Name" />
              </div>
              <div>
                <q-file
                  color="grey-3"
                  outlined
                  label-color="orange"
                  v-model="model"
                  label="Select Image"
                >
                  <template v-slot:before>
                    <q-avatar>
                      <img :src="image" />
                    </q-avatar>
                  </template>
                  <template v-slot:append>
                    <q-icon name="attachment" color="orange" />
                  </template>
                </q-file>
              </div>
              <div class="q-pa-md" style="max-width: 300px">
                <q-input filled v-model="date" mask="date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Ok"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div>
                <q-editor
                  v-model="qeditor"
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
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
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
                      {
                        label: $q.lang.editor.defaultFont,
                        icon: $q.iconSet.editor.font,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: [
                          'default_font',
                          'arial',
                          'arial_black',
                          'comic_sans',
                          'courier_new',
                          'impact',
                          'lucida_grande',
                          'times_new_roman',
                          'verdana',
                        ],
                      },
                      'removeFormat',
                    ],

                    ['undo', 'redo'],
                    ['viewsource'],
                  ]"
                  :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana',
                  }"
                />
              </div>
            </div>
          </div>
        </q-layout>
        <div style="position: absolute; bottom: 0px; right: 0px">
          <q-card-actions class="bg-white text-teal">
            <q-btn flat label="cancel" v-close-popup />
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layout: false,
      model: null,
      moreContent: true,
      drawer: false,
      drawerR: false,
      date: "2020/11/13",
      persistent: false,
      image:
        "https://www.pngitem.com/pimgs/m/516-5167304_transparent-background-white-user-icon-png-png-download.png",
      lorem:
        "Lorem ipsum dolor sit Natus, ratione eum minus fuga, quasis magnam, suscipit at quo nostrum!",
      qeditor:
        "<pre>Check out the two different types of dropdowns" +
        ' in each of the "Align" buttons.</pre> ',
    };
  },
  methos: {
    format: function (valu) {
      this.date = new Date(valu);
      if (!isNaN(date.getTime())) {
        return (
          this.date.getMonth() +
          1 +
          "/" +
          this.date.getDate() +
          "/" +
          this.date.getFullYear()
        );
      }
    },
  },

  computed: {
    contentSize() {
      return this.moreContent ? 150 : 5;
    },
  },
};
</script>
