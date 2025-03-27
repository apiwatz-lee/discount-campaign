import { useEffect, useState } from 'react';
import './App.css';
import { initialCart } from './data/initialCart';
import CampaignSelector from './components/CampaignSelector';
import CartDetails from './components/CartDetails';
import PriceDetail from './components/PriceDetail';

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
        <div key={campaign} className='flex gap-4 flex-wrap'>
          <label className=' text-start content-center'>
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
            className='border border-gray-200 rounded-xl p-2 sm:ml-4'
          />
        </div>
      ),
      calculateDiscount: (totalBeforeDiscount, amount) => {
        const balance = totalBeforeDiscount - amount;
        setEachDiscount((prev) => ({
          ...prev,
          fixedAmount: {
            ...prev.fixedAmount,
            discountAmount: amount,
            balance: balance,
          },
        }));
        return balance;
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
        <div key={campaign} className='flex gap-4 flex-wrap'>
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
        const balance =
          totalBeforeDiscount - totalBeforeDiscount * percentage * 0.01;
        setEachDiscount((prev) => ({
          ...prev,
          percentageDiscount: {
            ...prev.percentageDiscount,
            discountPercent: percentage,
            discountAmount: totalBeforeDiscount * percentage * 0.01,
            balance: balance,
          },
        }));
        return balance;
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
        <div key={campaign} className='flex flex-col gap-2'>
          <div>
            <label className='min-w-22 text-start content-center'>
              Category
            </label>
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
              className='border border-gray-200 rounded-xl p-2 ml-8'
            >
              {params.productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              className='border border-gray-200 rounded-xl p-2 ml-4 w-32'
            />
          </div>
        </div>
      ),
      calculateDiscount: (
        totalAfterCoupon,
        totalCategory,
        amount,
        selectedCategory
      ) => {
        const balance = totalAfterCoupon - totalCategory * amount * 0.01;
        setEachDiscount((prev) => ({
          ...prev,
          percentageDiscountByCategory: {
            ...prev.percentageDiscountByCategory,
            selectedCategory,
            totalCategory: totalCategory,
            discountPercent: amount,
            discountAmount: totalCategory * amount * 0.01,
            balance: balance,
          },
        }));
        return balance;
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
            className='border border-gray-200 rounded-xl p-2 ml-4 w-32'
          />
        </div>
      ),
      calculateDiscount: (totalAfterCoupon, points, total) => {
        const limitDiscount = total * 0.2;
        const discountAmount = points > limitDiscount ? limitDiscount : points;
        const balance = totalAfterCoupon - discountAmount;

        setEachDiscount((prev) => ({
          ...prev,
          discountByPoints: {
            ...prev.discountByPoints,
            discountAmount: discountAmount,
            balance: balance,
          },
        }));
        return balance;
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
          <div>
            <label className=' text-start content-center'>every (THB)</label>
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
              className='border border-gray-200 rounded-xl p-2 ml-8 w-32'
            />
          </div>

          <div className='mt-4'>
            <label className='text-start content-center'>discount (THB)</label>
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
              className='border border-gray-200 rounded-xl p-2 ml-3 w-32'
            />
          </div>
        </div>
      ),
      calculateDiscount: (totalAfterOnTop, everyAmount, willDiscount) => {
        const balance =
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
            balance: balance,
          },
        }));
        return balance;
      },
      order: 3,
    },
  ];
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const handleCalculateDiscount = () => {
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
    setNetPrice(handleCalculateDiscount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignApplies]);

  const totalDiscount = Object.entries(eachDiscount)
    // eslint-disable-next-line no-unused-vars
    .map(([key, value]) => value.discountAmount)
    .reduce((acc, item) => acc + item, 0);

  return (
    <main className='mx-auto container flex flex-col justify-center items-center gap-12 p-8 w-full max-w-5xl'>
      {campaigns.length > 0 && (
        <CampaignSelector
          onSubmit={handleApplyDiscount}
          onSelect={setSelectedCampaign}
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
        />
      )}

      <section className='flex flex-col justify-center items-center gap-8 w-full'>
        <CartDetails cart={cart} />
        <PriceDetail
          total={total}
          eachDiscount={eachDiscount}
          totalDiscount={totalDiscount}
          netPrice={netPrice}
          campaignApplies={campaignApplies}
        />
      </section>
    </main>
  );
}

export default App;
