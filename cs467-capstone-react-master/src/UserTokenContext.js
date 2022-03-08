import React, { createContext, useState } from 'react';

export const UserTokenContext = createContext({
  token: '',
  setToken: () => {}
});

export const CheckedOutBikeContext = createContext({
  checkedOutBike: '',
  setCheckedOutBike: () => {}
})
  