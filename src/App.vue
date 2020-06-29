<template>
  <v-app>
    <v-container class="ma-5 pa-5">
      <v-card flat outlined>
        <div class="float-right pr-2">
          <v-switch v-model="locked" :prepend-icon="locked ? `mdi-lock` : `mdi-lock-open`"></v-switch>
        </div>
        <v-row justify="center">
          <v-col cols="1">
            <v-text-field
              v-model="requestedCount"
              hide-details
              single-line
              type="number"
              min="1"
              max="10"
              :disabled="locked"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="requestedType"
              label="content items of type"
              :items="allTypes"
              item-text="caption"
              item-value="codename"
              :disabled="locked"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              label="being recommended by"
              v-model="scenario"
              :items="allScenarios"
              item-text="caption"
              item-value="id"
              :disabled="locked"
            >{{scenario.caption}}</v-select>
          </v-col>
        </v-row>
        <div align="center" v-if="!locked" class="caption warning pa-2 dark">
          By changing the recommendations you are customizing the outcome for
          <strong>this active content item ONLY</strong>. <br />If you wish to change global settings for the whole content type, please change the settings in the custom element settings in the model designer.
        </div>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    isDisabled: false,
    locked: true,
    itemCodename: "",
    requestedType: "",
    requestedCount: "",
    scenario: { id: "default", caption: "similarity and popularity" },
    allScenarios: [
      { id: "default", caption: "similarity and popularity" },
      { id: "similar", caption: "similarity" },
      { id: "popular", caption: "popularity" }
    ],
    allTypes: [{ codename: "article", caption: "article" }]
  }),
  mounted: function() {
    this.initCustomElement();
  },
  methods: {
    initCustomElement: function() {
      CustomElement.init((element, _context) => {
        this.isDisabled = element.disabled;

        let currentValue = element.value;

        let config = element.config;

        this.itemCodename = _context.item.codename;
        this.requestedType = { codename: config["type"], caption: config["type"] };
        this.requestedCount = config["count"];

        let projectId = _context.projectId;

        this.updateSize();
      });
    },
    updateSize: function() {
      // Updates the custom element height in the Kentico UI.
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      CustomElement.setHeight(height+35);
    },
    setValue: function(value) {
      if (!this.isDisabled) {
        CustomElement.setValue(value || null);
      }
    }
  }
};
</script>
