<template>
  <v-app>
    <v-container class="ma-5 pa-5">
      <v-row v-if="loading">
        <v-progress-linear :indeterminate="true"></v-progress-linear>
      </v-row>
      <v-card flat outlined v-else>
        <div class="float-right pr-2">
          <v-switch
            v-model="locked"
            :prepend-icon="locked ? `mdi-lock` : `mdi-lock-open`"
            :append-icon="!locked ? `mdi-content-save` : ``"
            :disabled="isDisabled"
          ></v-switch>
        </div>
        <v-row justify="center">
          <v-col cols="1">
            <v-text-field
              v-model="selectedRequestedCount"
              hide-details
              single-line
              type="number"
              min="1"
              max="10"
              :disabled="locked"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              v-model="selectedRequestedType"
              label="content items of type"
              :items="allTypes"
              item-text="caption"
              :disabled="locked"
              @click="updateSize"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="4">
            <v-select
              label="being recommended by"
              v-model="selectedScenario"
              :items="allScenarios"
              item-text="caption"
              :disabled="locked"
              return-object
            ></v-select>
          </v-col>
        </v-row>
        <div align="center" v-if="changed" class="caption warning pa-2 dark">
          Recommendation settings for this content item are different than the default ones.
          <br />You can
          <v-btn x-small class="ma-1 pl-1 pr-1" color="primary" :disabled="locked" @click="reset">
            <strong>reset</strong>
          </v-btn>the settings with the press of the button, if unlocked.
        </div>
        <div align="center" v-if="!locked" class="caption warning pa-2 dark">
          By changing the recommendations you are customizing the outcome for
          <strong>this active content item ONLY</strong>.
          <br />If you wish to change global settings for the whole content type, please change the settings in the custom element settings in the model designer.
        </div>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import DeliveryModelClient from "./DeliveryModelClient.js";

export default {
  name: "App",
  data: () => ({
    projectId: "",
    isDisabled: false,
    locked: true,
    loading: true,
    changed: false,
    defaultValue: {},
    value: {
      itemCodename: null,
      requestedType: null,
      requestedCount: null,
      scenario: null
    },
    selectedRequestedCount: null,
    selectedScenario: { id: "default", caption: "similarity and popularity" },
    selectedRequestedType: {},
    allScenarios: [
      { id: "default", caption: "similarity and popularity" },
      { id: "similar", caption: "similarity" },
      { id: "popular", caption: "popularity" }
    ],
    allTypes: []
  }),
  watch: {
    locked: {
      handler(val) {
        if (val) this.save();
        this.updateSize();
      }
    },
    selectedRequestedCount: {
      deep: true,
      handler() {
        this.setChanged();
      }
    },
    selectedScenario: {
      deep: true,
      handler() {
        this.setChanged();
      }
    },
    selectedRequestedType: {
      deep: true,
      handler() {
        this.setChanged();
      }
    }
  },
  computed: {},
  mounted: function() {
    this.initCustomElement();
    CustomElement.onDisabledChanged(this.handleDisable);
  },
  methods: {
    initCustomElement: function() {
      CustomElement.init((element, _context) => {
        this.isDisabled = element.disabled;
        this.projectId = _context.projectId;

        this.defaultValue = this.getValueFromConfig(element.config, _context);

        if (!element.value) {
          this.value = this.defaultValue;
          this.save();
        } else {
          this.value = JSON.parse(element.value);
        }

        this.changed = JSON.stringify(this.value) != JSON.stringify(this.defaultValue);

        this.selectedRequestedCount = this.value.requestedCount;
        this.selectedScenario = this.allScenarios.filter(s => s.id == this.value.scenario)[0];
        this.getKontentModels(this.value.requestedType);

        this.updateSize();
      });
    },
    getValueFromConfig(config, context) {
      return {
        itemCodename: context.item.codename,
        requestedType: config.type,
        requestedCount: config.count,
        scenario: config.scenario ? config.scenario : "default"
      };
    },
    reset: function() {
      this.value = this.defaultValue;
      this.selectedRequestedCount = this.value.requestedCount;
      this.selectedScenario = this.allScenarios.filter(s => s.id == this.value.scenario)[0];
      this.selectedRequestedType = this.allTypes.filter(t => t.codename == this.value.requestedType)[0];
    },
    updateSize: function() {
      this.$nextTick(function() {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        CustomElement.setHeight(height);
      });
    },
    handleDisable: function(disableState) {
      this.isDisabled = disableState;
    },
    save: function() {
      if (this.value) {
        this.value.scenario = this.selectedScenario.id;
        this.value.requestedType = this.selectedRequestedType.codename;
        this.value.requestedCount = parseInt(this.selectedRequestedCount);
        if (!this.isDisabled) {
          CustomElement.setValue(JSON.stringify(this.value));
        }
      }
    },
    getKontentModels(selected) {
      let client = new DeliveryModelClient(this.projectId);
      client.getModelsForProject().then(response => {
        for (let i = 0, x = 1, t; (t = response.data.types[i]); i++) {
          let item = {
            caption: t.system.name,
            codename: t.system.codename
          };
          this.allTypes.push(item);
        }
        this.selectedRequestedType = this.allTypes.filter(t => t.codename == selected)[0];
        this.loading = false;
      });
    },
    setChanged() {
      let val = {
        itemCodename: this.value.itemCodename,
        requestedType: this.selectedRequestedType.codename,
        requestedCount: parseInt(this.selectedRequestedCount),
        scenario: this.selectedScenario.id
      };

      this.changed = JSON.stringify(val) != JSON.stringify(this.defaultValue);
    }
  }
};
</script>
