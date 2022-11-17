import { useEffect } from "react";
import { getCurrentDateAction, getTimeslotsAction, initCurrentTimeSlotsAction } from "../store/actions/timeSlotActions";
import useAppSelector from "./useAppSelector";
import useAppDispatch from "./useAppDispatch";
import moment from "moment";
import { clearInitTimeslots } from "../store/reducers/timeSlotReducer";

export default function useTimeslot() {
  const timeslotReducer = useAppSelector((state) => state.timeSlotReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (timeslotReducer.getTimeSlotsStatus === "idle") {
      dispatch(getTimeslotsAction());
    }
  }, [timeslotReducer.getTimeSlotsStatus, dispatch]);

  /**
   * Once all default data is fetched, initialize
   * the time slots - this will get already existing slots, or
   * create a new one if it does not exist
   */
  useEffect(() => {
    const now = moment();

    if (timeslotReducer.getTimeSlotsStatus === "completed") {
      const shortDate = now.format("YYYY-MM-DD");
      const fullDate = now.toISOString();

      //@ts-ignore
      dispatch(getCurrentDateAction({ shortDate, fullDate }));

      let slots = [...timeslotReducer.slots];

      slots = slots.map((slot: any) => ({
        id: slot.id,
        available: slot.available,
        label: slot.label,
        time: slot.time,
      }));

      dispatch(
        //@ts-ignore
        initCurrentTimeSlotsAction({
          date: shortDate,
          slots: slots,
          now: true,
        })
      );

      return () => {
        dispatch(clearInitTimeslots());
      };
    }
    // eslint-disable-next-line
  }, [timeslotReducer.getTimeSlotsStatus, dispatch]);
}
