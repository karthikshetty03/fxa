/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

export type TooltipType = 'default' | 'error';

type TooltipProps = {
  msg: string;
  type?: TooltipType;
  className?: string;
};

export const Tooltip = ({ msg, type = 'default', className }: TooltipProps) => {
  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-grey-500';
  return (
    <div
      data-testid="tooltip"
      title={msg}
      className={classNames(
        `z-50 absolute py-2 px-6 text-center text-white
      p-3 -mt-16 rounded text-sm left-0 tooltip-${type}`,
        bgColor,
        className
      )}
    >
      {msg}
    </div>
  );
};

export default Tooltip;
