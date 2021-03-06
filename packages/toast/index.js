import Vue from 'vue';
import VueToast from './toast';

const defaultOptions = {
  type: 'text',
  mask: false,
  message: '',
  visible: true,
  duration: 3000,
  position: 'middle',
  forbidClick: false
};
const parseOptions = message => typeof message === 'object' ? message : { message };

let queue = [];
let singleton = true;
let currentOptions = { ...defaultOptions };

function createInstance() {
  if (!queue.length || !singleton) {
    const toast = new (Vue.extend(VueToast))({
      el: document.createElement('div')
    });
    document.body.appendChild(toast.$el);
    queue.push(toast);
  }
  return queue[queue.length - 1];
};

function Toast(options = {}) {
  const toast = createInstance();

  options = {
    ...currentOptions,
    ...parseOptions(options),
    clear() {
      toast.visible = false;
    }
  };

  Object.assign(toast, options);
  clearTimeout(toast.timer);

  if (options.duration > 0) {
    toast.timer = setTimeout(() => {
      toast.clear();
    }, options.duration);
  }

  return toast;
};

const createMethod = type => options => Toast({
  type, ...parseOptions(options)
});

['loading', 'success', 'fail'].forEach(method => {
  Toast[method] = createMethod(method);
});

Toast.clear = all => {
  if (queue.length) {
    if (all) {
      queue.forEach(toast => {
        toast.clear();
      });
      queue = [];
    } else if (singleton) {
      queue[0].clear();
    } else {
      queue.shift().clear();
    }
  }
};

Toast.setDefaultOptions = options => {
  Object.assign(currentOptions, options);
};

Toast.resetDefaultOptions = () => {
  currentOptions = { ...defaultOptions };
};

Toast.allowMultiple = (allow = true) => {
  singleton = !allow;
};

Vue.prototype.$toast = Toast;

export default Toast;
