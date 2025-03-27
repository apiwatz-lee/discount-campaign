import { formatNumberWithCommas } from '../common';

const PriceDetail = ({
  total = 0,
  eachDiscount = {},
  totalDiscount = 0,
  netPrice = 0,
  campaignApplies = [],
}) => {
  return (
    <div className='  flex flex-col gap-6 w-full'>
      <div className='font-bold text-gray-900'>
        TOTAL PRICE :{' '}
        <span className='font-bold text-red-500'>
          THB{formatNumberWithCommas(total)}
        </span>
      </div>

      <div>
        {Object.entries(eachDiscount).map(([key, value]) => {
          if (!value.discountAmount) return null;

          const discountLabels = {
            fixedAmount: (
              <>
                <span className='font-bold text-gray-900'>{`COUPON: `}</span>
                You saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.discountAmount)}!
                </span>{' '}
                Your remaining balance is{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            percentageDiscount: (
              <>
                <span className='font-bold text-gray-900'>{`COUPON: `}</span>
                You got a{' '}
                <span className='font-bold text-green-700'>
                  {value.discountPercent}%
                </span>
                {` discount, you saved`}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.discountAmount)}
                </span>
                . Your balance is now{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formatNumberWithCommas(value.balance)}.
                </span>
              </>
            ),
            percentageDiscountByCategory: (
              <>
                <span className='font-bold text-gray-900'>{`ON TOP: `}</span>
                Your{' '}
                <span className='font-bold text-green-700'>
                  {value.selectedCategory}
                </span>{' '}
                items received a{' '}
                <span className='font-bold text-green-700'>
                  {value.discountPercent}%
                </span>{' '}
                discount (
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.totalCategory)}
                </span>{' '}
                items in total), saving you{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.discountAmount)}
                </span>
                . Your balance is now{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            discountByPoints: (
              <>
                <span className='font-bold text-gray-900'>{`ON TOP: `}</span>
                You used your points and saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.discountAmount)}
                </span>
                . Your new balance is{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            specialCampaigns: (
              <>
                <span className='font-bold text-gray-900'>{`SEASONAL: `}</span>
                For every{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formatNumberWithCommas(value.everyAmount)}{' '}
                </span>
                spent, you get a{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.willDiscount)}
                </span>{' '}
                discount. This campaign, you saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formatNumberWithCommas(value.discountAmount)}
                </span>{' '}
                leaving you with a balance of{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formatNumberWithCommas(value.balance)}
                </span>
              </>
            ),
          };

          return <div key={key}>{discountLabels[key]}</div>;
        })}
      </div>

      {campaignApplies.length > 0 && (
        <div>
          <div className='font-bold text-gray-900'>
            NET DISCOUNT :{' '}
            <span className='font-bold text-green-700'>
              THB{formatNumberWithCommas(totalDiscount)}
            </span>
          </div>
          <div className='font-bold text-gray-900'>
            NET PRICE :{' '}
            <span className='font-bold text-red-500'>
              THB{formatNumberWithCommas(netPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDetail;
