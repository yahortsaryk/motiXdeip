import { VeLineClamp } from '@/casimir-framework/vue-elements';
import { defineComponent } from '@/casimir-framework/all';
import { AttributeReadMixin } from '../../mixins';

/**
 * Component for read only email attribute
 */
export default defineComponent({
  name: 'AttributeEmailRead',

  mixins: [AttributeReadMixin],

  methods: {
    /**
     * Generate text attribute for read only
     */
    genAttribute() {
      return (
        <VeLineClamp { ...{ props: this.proxyProps.VeLineClamp || {} }}>
          {this.internalValue}
        </VeLineClamp>
      );
    }
  }
});
