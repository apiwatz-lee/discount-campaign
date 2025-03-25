import { useEffect, useState } from 'react';
import './App.css';
import { initialCart } from './data/initialCart';

function App() {
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [discountApplies, setDiscountApplies] = useState([]);
  const [cart] = useState(initialCart);
  const [balance, setBalance] = useState(0);

  const initialDiscounts = [
    {
      campaign: 'Fixed amount',
      category: 'Coupon',
      parameter: {
        amount: 0,
      },
      component: (params, campaign) => (
        <div key={campaign}>
          <label className='min-w-22 text-start content-center'>
            Discount amount (THB)
          </label>
          <input
            onChange={(e) => {
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Fixed amount'
                    ? {
                        ...discount,
                        parameter: {
                          amount: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : discount
                )
              );
            }}
            value={params.amount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (total, amount) => total - amount,
      order: 1,
    },
    {
      campaign: 'Percentage discount',
      category: 'Coupon',
      parameter: {
        percentage: 0,
      },
      component: (params, campaign) => (
        <div key={campaign}>
          <label className='min-w-22 text-start content-center'>
            Discount amount (%)
          </label>
          <input
            onChange={(e) =>
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Percentage discount'
                    ? {
                        ...discount,
                        parameter: {
                          percentage: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : discount
                )
              )
            }
            value={params.percentage}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (total, percentage) =>
        total - (total * percentage) / 100,
      order: 1,
    },
    {
      campaign: 'Percentage discount by item category',
      category: 'On Top',
      parameter: {
        productCategories: ['Clothing', 'Accessories', 'Electronics'],
        amount: 0,
        selectedCategory: 'Clothing',
      },
      component: (params, campaign) => (
        <div key={campaign}>
          <label className='min-w-22 text-start content-center'>Category</label>
          <select
            value={params.selectedCategory}
            onChange={(e) =>
              setDiscounts(
                discounts.map((discount) =>
                  discount.campaign === 'Percentage discount by item category'
                    ? {
                        ...discount,
                        parameter: {
                          ...discount.parameter,
                          selectedCategory: e.target.value,
                        },
                      }
                    : discount
                )
              )
            }
          >
            {params.productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label className='min-w-22 text-start content-center'>
            Discount amount (%)
          </label>
          <input
            onChange={(e) =>
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Percentage discount by item category'
                    ? {
                        ...discount,
                        parameter: {
                          ...discount.parameter,
                          amount: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : discount
                )
              )
            }
            value={params.amount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (total, amount) => total - (total * amount) / 100,
      order: 2,
    },
    {
      campaign: 'Discount by points',
      category: 'On Top',
      parameter: {
        points: 0,
      },
      component: (params, campaign) => (
        <div key={campaign}>
          <label className='min-w-22 text-start content-center'>
            Customer Points
          </label>
          <input
            onChange={(e) =>
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Discount by points'
                    ? {
                        ...discount,
                        parameter: {
                          points: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : discount
                )
              )
            }
            value={params.points}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (total, points) => total - points,
      order: 2,
    },
    {
      campaign: 'Special campaigns',
      category: 'Seasonal',
      parameter: {
        everyAmount: 0,
        willDiscount: 0,
      },
      component: (params, campaign) => (
        <div key={campaign}>
          <label className='min-w-22 text-start content-center'>
            every (THB)
          </label>
          <input
            onChange={(e) =>
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Special campaigns'
                    ? {
                        ...discount,
                        parameter: {
                          ...discount.parameter,
                          everyAmount: Number(
                            e.target.value.replace(/\D/g, '')
                          ),
                        },
                      }
                    : discount
                )
              )
            }
            value={params.everyAmount}
            className='border border-gray-200 rounded-xl p-2'
          />

          <label className='min-w-22 text-start content-center'>
            discount (THB)
          </label>
          <input
            onChange={(e) =>
              setDiscounts((discounts) =>
                discounts.map((discount) =>
                  discount.campaign === 'Special campaigns'
                    ? {
                        ...discount,
                        parameter: {
                          ...discount.parameter,
                          willDiscount: Number(
                            e.target.value.replace(/\D/g, '')
                          ),
                        },
                      }
                    : discount
                )
              )
            }
            value={params.willDiscount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (total, everyAmount, willDiscount) =>
        total - Math.floor(total / everyAmount) * willDiscount,
      order: 3,
    },
  ];

  const [discounts, setDiscounts] = useState(initialDiscounts);

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    setDiscountApplies([
      discounts.find(
        (discount) => discount.campaign === selectedCampaign.campaign
      ),
      ...discountApplies,
    ]);
    setDiscounts(
      discounts.filter(
        (discount) =>
          discount.campaign !== selectedCampaign.campaign &&
          discount.category !== selectedCampaign.category
      )
    );
  };

  const sortDiscounts = (discounts) => {
    return discounts.sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    setSelectedCampaign(discounts[0]);
    setDiscountApplies((prev) => sortDiscounts(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountApplies]);

  // console.log('selectedCampaign', selectedCampaign);
  // console.log('discounts', discounts);
  console.log('discountApplies', discountApplies);

  return (
    <main className='mx-auto container flex flex-col justify-center items-center gap-12 my-28'>
      {discounts.length > 0 && (
        <form className='flex flex-col gap-4' onSubmit={handleApplyDiscount}>
          <div className='flex gap-4 '>
            <label className='min-w-22 text-start content-center'>
              Campaign
            </label>
            <select
              className='border border-gray-200 rounded-2xl p-2'
              onChange={(e) =>
                setSelectedCampaign(
                  discounts.find(
                    (discount) => discount.campaign === e.target.value
                  )
                )
              }
            >
              {discounts?.map(({ campaign, category }) => (
                <option key={campaign} value={campaign}>
                  {campaign} ({category})
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-4 '>
            {discounts?.map(
              (discount) =>
                discount?.campaign === selectedCampaign.campaign &&
                discount?.component(discount?.parameter, discount?.campaign)
            )}
          </div>
          <button
            type='submit'
            className='p-2 border border-gray-300 text-white bg-gray-800 rounded-full cursor-pointer hover:bg-gray-600 duration-300 '
          >
            Apply discount
          </button>
        </form>
      )}

      <section>
        <table className='table-auto'>
          <thead>
            <tr>
              <th className='border px-4 py-2'>Product</th>
              <th className='border px-4 py-2'>Price</th>
              <th className='border px-4 py-2'>Quantity</th>
              <th className='border px-4 py-2'>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ id, name, price, quantity }) => (
              <tr key={id}>
                <td className='border px-4 py-2'>{name}</td>
                <td className='border px-4 py-2'>{price}</td>
                <td className='border px-4 py-2'>{quantity}</td>
                <td className='border px-4 py-2'>{price * quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <div>Total : {total}</div>
        {discountApplies?.map((discount) => {
          const { campaign } = discount;

          switch (campaign) {
            case 'Fixed amount':
              return (
                <div key={discount?.campaign}>
                  {discount?.campaign} :
                  {discount?.calculateDiscount(
                    total,
                    discount?.parameter?.amount
                  )}
                </div>
              );
            case 'Percentage discount':
              return (
                <div key={discount?.campaign}>
                  {discount?.campaign} :
                  {discount?.calculateDiscount(
                    total,
                    discount?.parameter?.percentage
                  )}
                </div>
              );
            case 'Percentage discount by item category':
              return (
                <div key={discount?.campaign}>
                  {discount?.campaign} :
                  {discount?.calculateDiscount(
                    cart
                      .filter(
                        (item) =>
                          item?.category ===
                          discount?.parameter?.selectedCategory
                      )
                      .reduce((acc, curr) => acc + curr.price, 0),
                    discount?.parameter?.amount
                  )}
                </div>
              );
            case 'Discount by points':
              return (
                <div key={discount?.campaign}>
                  {discount?.campaign} :
                  {discount?.calculateDiscount(
                    total,
                    discount?.parameter?.points
                  )}
                </div>
              );
            case 'Special campaigns':
              return (
                <div key={discount?.campaign}>
                  {discount?.campaign} :
                  {discount?.calculateDiscount(
                    total,
                    discount?.parameter?.everyAmount,
                    discount?.parameter?.willDiscount
                  )}
                </div>
              );
            default:
              return null;
          }
        })}
      </section>
    </main>
  );
}

export default App;
