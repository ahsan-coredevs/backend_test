const express = require('express');
const orderSchema = require('../order/order.schema');
const userSchema = require('../user/user.schema');
const blogSchema = require('../blog/blog.schema');
const instructorSchema = require('../instructor/instructor.schema');
const courseSchema = require('../course/course.schema');

const router = express.Router();

const getDate= (filter)=>{
  const today = new Date();
  const oneDay = ( 1000 * 60 * 60 * 24 );
  const date =  filter==='week'? new Date( today.valueOf() - ( 7 * oneDay ) ): filter==='month'?new Date( today.valueOf() - ( 30 * oneDay ) ): filter==='year'?new Date( today.valueOf() - ( 365 * oneDay ) ):'';
  return date;
}

router.get('/stats/count', async (req, res) => {
  try {
    const orderCount = await orderSchema.countDocuments();
    const userCount = await userSchema.countDocuments();
    const blogCount = await blogSchema.countDocuments();
    const instructorCount = await instructorSchema.countDocuments();
    const courseCount = await courseSchema.countDocuments();

    return res.status(200).send({
      orders: orderCount,
      users: userCount,
      blogs: blogCount,
      instructors: instructorCount,
      courses: courseCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.get('/stats/order', async (req, res) => {
  try {

    const filter = req.query?.filter;
    if (!filter) {
      return res.status(400).send({ message: 'Bad request' });
    }
    const orderStats = await orderSchema.aggregate([
      {
        $match: {
          createdAt: { $gt: getDate(filter) }
        }
      },
      {
        $addFields: {
          day: { [filter==='week'?'$dayOfWeek':filter==='month'?'$dayOfMonth':'$month']: '$createdAt' }
        }
      },
      {
        $group: {
          _id: `$day`,
          orderCount: { $sum: 1 }
        }
      }
    ]);
   

   
    const categories = [];
    const values = [];

    if (filter === 'week') {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
     
      for (let i = 0; i <= 6; i++) {
        const date = new Date(new Date().setDate(new Date().getDate() - i));
        const day = date.getDay();
        const count = orderStats.find(o => o._id === day)?.orderCount || 0;
        categories.push(days[day]);
        values.push(count);
      }
    } else if (filter === 'month') {

      let i=0;
      while(i<30) {
        categories.unshift(Math.abs(new Date().getDate()-i));
        i++;
      }
      categories.forEach(cat=>{
        const isFound= orderStats.find(st=>st._id===cat);
        values.push( isFound?isFound.orderCount:0);
      })
      return res.status(200).send({categories, values})
     
    }  else if (filter === 'year') { 
      
     
      const  date= new Date();
      let i=12;
      while(i--) {
        categories.unshift(date.toLocaleString('default', { month: 'short' }));
        const isFound= orderStats.find(st=>st._id===(date.getMonth()+1));
        values.unshift(isFound? isFound.orderCount:0)
        date.setMonth( date.getMonth()-1);
      
      }
      
    
      return res.status(200).send({ categories, values });
    }

    return res.status(200).send({ categories, values });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

module.exports = router;
