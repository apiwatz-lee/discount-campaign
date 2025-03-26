import { useEffect, useState } from 'react';
import './App.css';
import { initialCart } from './data/initialCart';

function App() {
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [campaignApplies, setCampaignApplies] = useState([]);
  const [cart] = useState(initialCart);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [netPrice, setNetPrice] = useState(total);
  const [eachDiscount, setEachDiscount] = useState({
    fixedAmount: {
      amount: 0,
      balance: 0,
    },
    percentageDiscount: {
      amount: 0,
      balance: 0,
    },
    percentageDiscountByCategory: {
      amount: 0,
      balance: 0,
    },
    discountByPoints: {
      amount: 0,
      balance: 0,
    },
    specialCampaigns: {
      everyAmount: 0,
      willDiscount: 0,
      amount: 0,
      balance: 0,
    },
  });

  const initialCampaigns = [
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Fixed amount'
                    ? {
                        ...prev,
                        parameter: {
                          amount: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : prev
                )
              );
            }}
            value={params.amount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (totalBeforeDiscount, amount) => {
        const formulars = totalBeforeDiscount - amount;
        setEachDiscount((eachDiscount) => ({
          ...eachDiscount,
          fixedAmount: {
            ...eachDiscount.fixedAmount,
            amount,
            balance: formulars,
          },
        }));
        return formulars;
      },
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Percentage discount'
                    ? {
                        ...prev,
                        parameter: {
                          percentage: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : prev
                )
              )
            }
            value={params.percentage}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (totalBeforeDiscount, percentage) => {
        const formulars =
          totalBeforeDiscount - totalBeforeDiscount * percentage * 0.01;
        setEachDiscount((eachDiscount) => ({
          ...eachDiscount,
          percentageDiscount: {
            ...eachDiscount.percentageDiscount,
            amount: totalBeforeDiscount * percentage * 0.01,
            balance: formulars,
          },
        }));
        return formulars;
      },
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
              setCampaigns(
                campaigns.map((prev) =>
                  prev.campaign === 'Percentage discount by item category'
                    ? {
                        ...prev,
                        parameter: {
                          ...prev.parameter,
                          selectedCategory: e.target.value,
                        },
                      }
                    : prev
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Percentage discount by item category'
                    ? {
                        ...prev,
                        parameter: {
                          ...prev.parameter,
                          amount: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : prev
                )
              )
            }
            value={params.amount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (totalAfterCoupon, totalCategory, amount) => {
        const formulars = totalAfterCoupon - totalCategory * amount * 0.01;
        setEachDiscount((eachDiscount) => ({
          ...eachDiscount,
          percentageDiscountByCategory: {
            ...eachDiscount.percentageDiscountByCategory,
            amount: totalCategory * amount * 0.01,
            balance: formulars,
          },
        }));
        return formulars;
      },
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Discount by points'
                    ? {
                        ...prev,
                        parameter: {
                          points: Number(e.target.value.replace(/\D/g, '')),
                        },
                      }
                    : prev
                )
              )
            }
            value={params.points}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (totalAfterCoupon, points) => {
        const formulars = totalAfterCoupon - points;
        setEachDiscount((eachDiscount) => ({
          ...eachDiscount,
          discountByPoints: {
            ...eachDiscount.discountByPoints,
            amount: points,
            balance: formulars,
          },
        }));
        return formulars;
      },
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Special campaigns'
                    ? {
                        ...prev,
                        parameter: {
                          ...prev.parameter,
                          everyAmount: Number(
                            e.target.value.replace(/\D/g, '')
                          ),
                        },
                      }
                    : prev
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
              setCampaigns((campaigns) =>
                campaigns.map((prev) =>
                  prev.campaign === 'Special campaigns'
                    ? {
                        ...prev,
                        parameter: {
                          ...prev.parameter,
                          willDiscount: Number(
                            e.target.value.replace(/\D/g, '')
                          ),
                        },
                      }
                    : prev
                )
              )
            }
            value={params.willDiscount}
            className='border border-gray-200 rounded-xl p-2'
          />
        </div>
      ),
      calculateDiscount: (totalAfterOnTop, everyAmount, willDiscount) => {
        const formulars =
          totalAfterOnTop -
          Math.floor(totalAfterOnTop / everyAmount) * willDiscount;

        setEachDiscount((eachDiscount) => ({
          ...eachDiscount,
          specialCampaigns: {
            ...eachDiscount.specialCampaigns,
            willDiscount,
            everyAmount,
            amount: Math.floor(totalAfterOnTop / everyAmount) * willDiscount,
            balance: formulars,
          },
        }));
        return formulars;
      },
      order: 3,
    },
  ];

  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const handleCalculateFinalPrice = () => {
    return campaignApplies.reduce((currentTotal, item) => {
      switch (item.campaign) {
        case 'Fixed amount':
          return item.calculateDiscount(currentTotal, item.parameter.amount);
        case 'Percentage discount':
          return item.calculateDiscount(
            currentTotal,
            item.parameter.percentage
          );
        case 'Percentage discount by item category':
          return item.calculateDiscount(
            currentTotal,
            cart
              .filter(
                ({ category }) => category === item.parameter.selectedCategory
              )
              .reduce((acc, item) => acc + item.price * item.quantity, 0),
            item.parameter.amount
          );
        case 'Discount by points':
          return item.calculateDiscount(currentTotal, item.parameter.points);
        case 'Special campaigns':
          return item.calculateDiscount(
            currentTotal,
            item.parameter.everyAmount,
            item.parameter.willDiscount
          );
        default:
          return currentTotal;
      }
    }, total);
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    setCampaignApplies(
      [
        ...campaignApplies,
        campaigns.find((prev) => prev.campaign === selectedCampaign.campaign),
      ].sort((a, b) => a.order - b.order)
    );
    setCampaigns(
      campaigns.filter(
        (prev) =>
          prev.campaign !== selectedCampaign.campaign &&
          prev.category !== selectedCampaign.category
      )
    );
  };

  useEffect(() => {
    setSelectedCampaign(campaigns[0]);
    setNetPrice(handleCalculateFinalPrice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignApplies]);

  return (
    <main className='mx-auto container flex flex-col justify-center items-center gap-12 my-28'>
      {campaigns.length > 0 && (
        <form className='flex flex-col gap-4' onSubmit={handleApplyDiscount}>
          <div className='flex gap-4 '>
            <label className='min-w-22 text-start content-center'>
              Campaign
            </label>
            <select
              className='border border-gray-200 rounded-2xl p-2'
              onChange={(e) =>
                setSelectedCampaign(
                  campaigns.find(
                    (discount) => discount.campaign === e.target.value
                  )
                )
              }
            >
              {campaigns?.map(({ campaign, category }) => (
                <option key={campaign} value={campaign}>
                  {campaign} ({category})
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-4 '>
            {campaigns?.map(
              (prev) =>
                prev?.campaign === selectedCampaign.campaign &&
                prev?.component(prev?.parameter, prev?.campaign)
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
              <th className='border px-4 py-2'>Category</th>
              <th className='border px-4 py-2'>Price</th>
              <th className='border px-4 py-2'>Quantity</th>
              <th className='border px-4 py-2'>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ id, name, price, quantity, category }) => (
              <tr key={id}>
                <td className='border px-4 py-2'>{name}</td>
                <td className='border px-4 py-2'>{category}</td>
                <td className='border px-4 py-2'>{price}</td>
                <td className='border px-4 py-2'>{quantity}</td>
                <td className='border px-4 py-2'>{price * quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <div>Total before discount : {total}</div>
        {Object.entries(eachDiscount).map(([key, value]) => {
          // if (!value.amount) return null;

          const discountLabels = {
            fixedAmount: 'Fixed amount :',
            percentageDiscount: 'Percentage discount % :',
            percentageDiscountByCategory:
              'Percentage discount by item category :',
            discountByPoints: 'Discount by points :',
            specialCampaigns: `Special campaigns : every ${value.everyAmount} will discount ${value.willDiscount}`,
          };

          return (
            <div key={key}>
              {discountLabels[key]} {key === 'specialCampaigns' && `amount `}
              {value.amount} balance {value.balance}
            </div>
          );
        })}

        {campaignApplies.length > 0 && <div>Net price : {netPrice}</div>}
      </section>
    </main>
  );
}

export default App;
