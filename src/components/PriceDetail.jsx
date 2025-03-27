import { formarNumberWithCommas } from '../common';

const PriceDetail = ({
  total,
  eachDiscount,
  totalDiscount,
  netPrice,
  campaignApplies,
}) => {
  return (
    <div className='min-w-xl max-w-xl flex flex-col gap-6'>
      <div className='font-bold'>
        TOTAL PRICE :{' '}
        <span className='font-bold text-red-500'>
          THB{formarNumberWithCommas(total)}
        </span>
      </div>

      <div>
        {Object.entries(eachDiscount).map(([key, value]) => {
          if (!value.discountAmount) return null;

          const discountLabels = {
            fixedAmount: (
              <>
                <span className='font-bold text-green-700'>{`COUPON: `}</span>
                You saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.discountAmount)}!
                </span>{' '}
                Your remaining balance is{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            percentageDiscount: (
              <>
                <span className='font-bold text-green-700'>{`COUPON: `}</span>
                You got a{' '}
                <span className='font-bold text-green-700'>
                  {value.discountPercent}%
                </span>
                , you saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.discountAmount)}
                </span>
                . Your balance is now{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formarNumberWithCommas(value.balance)}.
                </span>
              </>
            ),
            percentageDiscountByCategory: (
              <>
                <span className='font-bold text-green-700'>{`ON TOP: `}</span>
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
                  THB{formarNumberWithCommas(value.totalCategory)}
                </span>{' '}
                items in total), saving you{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.discountAmount)}
                </span>
                . Your balance is now{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            discountByPoints: (
              <>
                <span className='font-bold text-green-700'>{`ON TOP: `}</span>
                You used your points and saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.discountAmount)}
                </span>
                . Your new balance is{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.balance)}
                </span>
                .
              </>
            ),
            specialCampaigns: (
              <>
                <span className='font-bold text-green-700'>{`SEASONAL: `}</span>
                For every{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formarNumberWithCommas(value.everyAmount)}{' '}
                </span>
                spent, you get a{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.willDiscount)}
                </span>{' '}
                discount. This time, you saved{' '}
                <span className='font-bold text-green-700'>
                  THB{formarNumberWithCommas(value.discountAmount)}
                </span>{' '}
                leaving you with a balance of{' '}
                <span className='font-bold text-green-700'>
                  THB
                  {formarNumberWithCommas(value.balance)}
                </span>
              </>
            ),
          };

          return <div key={key}>{discountLabels[key]}</div>;
        })}
      </div>

      {campaignApplies.length > 0 && (
        <div>
          <div className='font-bold'>
            NET DISCOUNT :{' '}
            <span className='font-bold text-green-700'>
              THB{formarNumberWithCommas(totalDiscount)}
            </span>
          </div>
          <div className='font-bold '>
            NET PRICE :{' '}
            <span className='font-bold text-red-500'>
              THB{formarNumberWithCommas(netPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDetail;
