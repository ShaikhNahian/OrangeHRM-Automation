const { dataMutation } = require('../config/config');

class DataGenerator {
  static uniqueSuffix() {
    return Date.now().toString().slice(-6);
  }

  static maybeMutate(value, type = 'name') {
    if (!dataMutation.enabled) {
      return value;
    }

    const suffix = this.uniqueSuffix();

    switch (type) {
      case 'username':
        return `${value}_${suffix}`;
      case 'name':
      default:
        return `${value}${suffix}`;
    }
  }
}

module.exports = DataGenerator;