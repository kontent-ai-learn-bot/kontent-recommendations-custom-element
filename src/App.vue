<template>
  <v-app>
    <v-content>Hello</v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    isDisabled: false
  }),
  mounted: function() {
    this.initCustomElement();
  },
  methods: {
    initCustomElement: () => {
      CustomElement.init((element, _context) => {
        this.isDisabled = element.disabled;

        let config = element.config;
        let currentValue = element.value;

        let projectId = _context.projectId;
        let codename = _context.item.codename;

        this.updateSize();
      });
    },
    updateSize: () => {
      // Updates the custom element height in the Kentico UI.
      const height = Math.ceil(document.querySelector("html").height());
      CustomElement.setHeight(height);
    },
    setValue: value => {
      if (!this.isDisabled) {
        CustomElement.setValue(value || null);
      }
    }
  }
};
</script>
