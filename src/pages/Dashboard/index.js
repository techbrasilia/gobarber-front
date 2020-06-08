import React, { useState, useMemo, useEffect } from 'react';
import {
    format,
    subDays,
    addDays,
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    isBefore,
    isEqual,
    parseISO,
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';

import { Container, Time } from './styles';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '~/services/api';

const range = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19];

export default function Dashboard() {
    const [schedule, setSchedule] = useState([]);
    const [date, setDate] = useState(new Date());
    const dateFormated = useMemo(
        () => format(date, "d 'de' MMMM", { locale: pt }),
        [date]
    );

    useEffect(() => {
        async function loadSchedule() {
            const response = await api.get('schedule', {
                params: { date },
            });

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const data = range.map((hour) => {
                const checkDate = setMilliseconds(
                    setSeconds(setMinutes(setHours(date, hour), 0), 0),
                    0
                );
                const compareDate = utcToZonedTime(checkDate, timeZone);

                return {
                    time: `${hour}: 00h`,
                    past: isBefore(compareDate, new Date()),
                    appointment: response.data.find((a) =>
                        isEqual(parseISO(a.data), compareDate)
                    ),
                };
            });

            setSchedule(data);
        }

        loadSchedule();
    }, [date]);

    function handlePrevDay() {
        setDate(subDays(date, 1));
    }

    function handleNextDay() {
        setDate(addDays(date, 1));
    }

    return (
        <Container>
            <header>
                <button type="button" onClick={handlePrevDay}>
                    <MdChevronLeft size={36} color="#fff" />
                </button>
                <strong>{dateFormated}</strong>
                <button type="button" onClick={handleNextDay}>
                    <MdChevronRight size={36} color="#fff" />
                </button>
            </header>

            <ul>
                {schedule.map((time) => (
                    <Time
                        key={time.time}
                        past={time.past}
                        available={!time.appointment}
                    >
                        <strong>{time.time}</strong>
                        <span>
                            {time.appointment
                                ? time.appointment.user.name
                                : 'Em aberto'}
                        </span>
                    </Time>
                ))}
            </ul>
        </Container>
    );
}
