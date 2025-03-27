const CampaignSelector = ({
  onSubmit = () => {},
  onSelect = () => {},
  campaigns = [],
  selectedCampaign = {},
}) => {
  return (
    <form className='flex flex-col gap-4 w-full' onSubmit={onSubmit}>
      <div className='flex flex-col gap-4 '>
        <label className=' text-center content-center font-extrabold text-green-800'>
          Campaigns
        </label>
        <select
          className='border border-gray-200 rounded-2xl p-2'
          onChange={(e) => {
            if (e.target.value === '') return;

            onSelect(
              campaigns.find((discount) => discount.campaign === e.target.value)
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
  );
};

export default CampaignSelector;
