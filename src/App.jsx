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
      discountAmount: 0,
      balance: 0,
    },
    percentageDiscount: {
      discountAmount: 0,
      balance: 0,
    },
    percentageDiscountByCategory: {
      selectedCategory: '',
      totalCategory: 0,
      discountAmount: 0,
      discountPercent: 0,
      balance: 0,
    },
    discountByPoints: {
      discountAmount: 0,
      balance: 0,
    },
    specialCampaigns: {
      everyAmount: 0,
      willDiscount: 0,
      discountAmount: 0,
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
        setEachDiscount((prev) => ({
          ...prev,
          fixedAmount: {
            ...eachDiscount.fixedAmount,
            discountAmount: amount,
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
        setEachDiscount((prev) => ({
          ...prev,
          percentageDiscount: {
            ...prev.percentageDiscount,
            discountPercent: percentage,
            discountAmount: totalBeforeDiscount * percentage * 0.01,
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
      calculateDiscount: (
        totalAfterCoupon,
        totalCategory,
        amount,
        selectedCategory
      ) => {
        const formulars = totalAfterCoupon - totalCategory * amount * 0.01;
        setEachDiscount((prev) => ({
          ...prev,
          percentageDiscountByCategory: {
            ...prev.percentageDiscountByCategory,
            selectedCategory,
            totalCategory: totalCategory,
            discountPercent: amount,
            discountAmount: totalCategory * amount * 0.01,
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
      calculateDiscount: (totalAfterCoupon, points, total) => {
        const limitDiscount = total * 0.2;
        const discountAmount = points > limitDiscount ? limitDiscount : points;
        const formulars = totalAfterCoupon - discountAmount;

        setEachDiscount((prev) => ({
          ...prev,
          discountByPoints: {
            ...prev.discountByPoints,
            discountAmount: discountAmount,
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

        setEachDiscount((prev) => ({
          ...prev,
          specialCampaigns: {
            ...prev.specialCampaigns,
            willDiscount,
            everyAmount,
            discountAmount:
              Math.floor(totalAfterOnTop / everyAmount) * willDiscount,
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
            item.parameter.amount,
            item.parameter.selectedCategory
          );
        case 'Discount by points':
          return item.calculateDiscount(
            currentTotal,
            item.parameter.points,
            total
          );
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

  const handleValidateInput = () => {
    if (!selectedCampaign.campaign) return false;

    const fixedAmount = campaigns.find(
      (item) => item.campaign === 'Fixed amount'
    );
    const percentageDiscount = campaigns.find(
      (item) => item.campaign === 'Percentage discount'
    );
    const percentageDiscountByCategory = campaigns.find(
      (item) => item.campaign === 'Percentage discount by item category'
    );
    const discountByPoints = campaigns.find(
      (item) => item.campaign === 'Discount by points'
    );
    const specialCampaigns = campaigns.find(
      (item) => item.campaign === 'Special campaigns'
    );

    switch (selectedCampaign.campaign) {
      case 'Fixed amount':
        return (
          fixedAmount.parameter.amount > 0 &&
          fixedAmount.parameter.amount <= total
        );
      case 'Percentage discount':
        return (
          percentageDiscount.parameter.percentage > 0 &&
          percentageDiscount.parameter.percentage <= 100
        );
      case 'Percentage discount by item category':
        return (
          percentageDiscountByCategory.parameter.amount > 0 &&
          percentageDiscountByCategory.parameter.amount <= 100 &&
          percentageDiscountByCategory.parameter.selectedCategory
        );
      case 'Discount by points':
        return discountByPoints.parameter.points > 0;
      case 'Special campaigns':
        return (
          specialCampaigns.parameter.everyAmount > 0 &&
          specialCampaigns.parameter.willDiscount > 0 &&
          specialCampaigns.parameter.everyAmount < total &&
          specialCampaigns.parameter.willDiscount <
            specialCampaigns.parameter.everyAmount
        );
      default:
        return false;
    }
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (handleValidateInput()) {
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
    }
  };

  useEffect(() => {
    // setSelectedCampaign(campaigns[0]);
    setNetPrice(handleCalculateFinalPrice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignApplies]);

  // console.log('selectedCampaign', selectedCampaign);
  console.log('discountApplies', campaignApplies);

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
              onChange={(e) => {
                if (e.target.value === '') return;

                setSelectedCampaign(
                  campaigns.find(
                    (discount) => discount.campaign === e.target.value
                  )
                );
              }}
            >
              <option value=''>Select campaign</option>
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

      <section className='flex gap-8'>
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

        <div>
          <div>Total before discount : {total}</div>
          {Object.entries(eachDiscount).map(([key, value]) => {
            if (!value.discountAmount) return null;

            const discountLabels = {
              fixedAmount: `You saved ${value.discountAmount}! Your remaining balance is ${value.balance}.`,
              percentageDiscount: `Awesome! You got a ${value.discountPercent}%, you saved ${value.discountAmount} THB. Your balance is now ${value.balance}.`,
              percentageDiscountByCategory: `Great news! Your ${value.selectedCategory} items received a ${value.discountPercent}% discount (${value.totalCategory} items in total), saving you ${value.discountAmount}. Your balance is now ${value.balance}.`,
              discountByPoints: `Nice! You used your points and saved ${value.discountAmount}. Your new balance is ${value.balance}.`,
              specialCampaigns: `Lucky you! For every ${value.everyAmount} spent, you get a ${value.willDiscount} discount. This time, you saved ${value.discountAmount}, leaving you with a balance of ${value.balance}.`,
            };

            return <div key={key}>{discountLabels[key]}</div>;
          })}

          {campaignApplies.length > 0 && <div>Net price : {netPrice}</div>}
        </div>
      </section>
    </main>
  );
}

export default App;
