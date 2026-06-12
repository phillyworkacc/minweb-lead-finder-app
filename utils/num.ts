type FormatNumberConfig = {
   prefix?: string;
   useCommas?: boolean;
   useShorthand?: boolean;
   showShortHand?: boolean;
   showDecimals?: boolean;
   decimalPlaces?: number;
}

export function formatNumber (number: number, userConfig: FormatNumberConfig) {
   let workingNumber = `${parseFloat(`${number}`).toFixed(userConfig.decimalPlaces || 2)}`
   let shortHandSuffix = ''
   const config: FormatNumberConfig = {
      prefix: '',
      useCommas: false,
      useShorthand: false,
      showDecimals: false,
      decimalPlaces: 2,
      showShortHand: false,
      ...userConfig
   }
   
   // add shorthand suffix
   if (config.useShorthand) {
      if (number >= 1000000000) {
         workingNumber = `${(number/1000000000).toFixed(config.decimalPlaces || 2)}`
         shortHandSuffix = 'B'
      } else if (number >= 1000000) {
         workingNumber = `${(number/1000000).toFixed(config.decimalPlaces || 2)}`
         shortHandSuffix = 'M'
      } else if (number >= 1000) {
         workingNumber = `${(number/1000).toFixed(config.decimalPlaces || 2)}`
         shortHandSuffix = 'k'
      }
      if (!config.showShortHand) {
         shortHandSuffix = ''
      }
   }
   
   // add commas
   if (config.useCommas) {
      const wholeNumberPart = workingNumber.split(".")[0];
      const decimalPart = workingNumber.split(".")[1];
      let numberWithComma = wholeNumberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      workingNumber = (decimalPart == undefined)
         ? `${numberWithComma}`
         : `${numberWithComma}.${decimalPart}`;
   }
   
   // modify based on showDecimals
   const wholeNumberPart = workingNumber.split(".")[0];
   const decimalPart = workingNumber.split(".")[1];
   workingNumber = config.showDecimals
      ? `${wholeNumberPart}.${decimalPart}`
      : `${workingNumber.split(".")[0]}`;
   
   return `${config.prefix || ''}${workingNumber}${shortHandSuffix}`
}