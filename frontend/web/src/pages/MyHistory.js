import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionRejected from "../components/ActionRejected";
import HistoryList from "../components/History/History.List";
import PageLoader from "../components/PageLoader";
import { getMyHistoryAction } from "../redux/slice/historySlice";

const MyHistory = () => {
  const dispatch = useDispatch();
  const getMyHistoryState = useSelector(
    (__state__) => __state__.historyFromChatGPT
  );

  useEffect(() => {
    dispatch(getMyHistoryAction());
  }, [dispatch]);

  return (
    <div id="my-history">
      <h5>History</h5>
      {!getMyHistoryState.fulfilled && !getMyHistoryState.error && (
        <>
          <PageLoader message="Retrieving Your History" />
        </>
      )}

      {getMyHistoryState.fulfilled && !getMyHistoryState.error && (
        <HistoryList list={getMyHistoryState.history.chat} />
      )}

      {getMyHistoryState.rejected && (
        <ActionRejected message={getMyHistoryState.error} />
      )}
    </div>
  );
};

export default MyHistory;
